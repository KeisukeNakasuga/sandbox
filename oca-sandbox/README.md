
## strace
```bash
docker compose up -d --build
docker compose ps
docker top <PID>

sudo strace -f -c -p <PID>
```

上記コマンドで計測の準備後、`curl -o /dev/null http://localhost:3000/videos/1` を100回実行して計測。

```
┌──────────────────┬────────────────────────────┐
│       指標       │             値             │
├──────────────────┼────────────────────────────┤
│ 平均転送時間     │ 0.3355秒                   │
├──────────────────┼────────────────────────────┤
│ 最短/最長        │ 0.3193秒 / 0.3766秒        │
├──────────────────┼────────────────────────────┤
│ 標準偏差         │ 0.0100秒（かなり安定）     │
├──────────────────┼────────────────────────────┤
│ 平均スループット │ 約2,163 MB/s（≒17.3 Gbps） │
└──────────────────┴────────────────────────────┘
```

1回分の結果メモ。
```
  ❯ sudo strace -f -c -p 257221
  Password:
  strace: Process 257221 attached with 30 threads
  strace: Process 258124 attached
  strace: Process 258125 attached
  strace: Process 258126 attached
  strace: Process 258127 attached
  ^Cstrace: Process 258124 detached
  strace: Process 258127 detached
  strace: Process 258126 detached
  strace: Process 258125 detached
  strace: Process 258082 detached
  strace: Process 258081 detached
  strace: Process 258080 detached
  strace: Process 258079 detached
  strace: Process 258078 detached
  strace: Process 258077 detached
  strace: Process 258076 detached
  strace: Process 257356 detached
  strace: Process 257355 detached
  strace: Process 257354 detached
  strace: Process 257353 detached
  strace: Process 257352 detached
  strace: Process 258080 detached
  strace: Process 258079 detached
  strace: Process 258078 detached
  strace: Process 258077 detached
  strace: Process 258076 detached
  strace: Process 257356 detached
  strace: Process 257355 detached
  strace: Process 257354 detached
  strace: Process 257353 detached
  strace: Process 257352 detached
  strace: Process 257351 detached
  strace: Process 257348 detached
  strace: Process 257347 detached
  strace: Process 257346 detached
  strace: Process 257345 detached
  strace: Process 257344 detached
  strace: Process 257343 detached
  strace: Process 257342 detached
  strace: Process 257341 detached
  strace: Process 257340 detached
  strace: Process 257339 detached
  strace: Process 257338 detached
  strace: Process 257337 detached
  strace: Process 257336 detached
  strace: Process 257335 detached
  strace: Process 257334 detached
  strace: Process 257221 detached
  % time     seconds  usecs/call     calls    errors syscall
  ------ ----------- ----------- --------- --------- ------------------
   96.88   20.246059         278
    1.00    0.208238          18     11085           epoll_pwait2
    0.79    0.165771          14     11066           read
    0.53    0.111588          13      8086           sched_yield
    0.52    0.108402           9     11067           sendto
    0.22    0.046407           4     11068           write
    0.03    0.006510          26       249           madvise
    0.02    0.003384         376         9         1 restart_syscall
    0.00    0.000526           3       172           pread64
    0.00    0.000219          54         4           clone
    0.00    0.000084           4        17           rt_sigprocmask
    0.00    0.000028           7         4           rseq
    0.00    0.000018           4         4           sched_getaffinity
    0.00    0.000017           8         2           close
    0.00    0.000015           3         4           prctl
    0.00    0.000015           3         4           set_robust_list
    0.00    0.000013           3
    0.00    0.000012           3
    0.00    0.000007           1         5           epoll_ctl
    0.00    0.000002           1         2           recvfrom
    0.00    0.000000           0         1           setsockopt
    0.00    0.000000           0
    0.00    0.000000           0         2         1 accept4
    0.00    0.000000           0         1           statx
  ------ ----------- ----------- --------- --------- ------------------
  100.00   20.897315         166    125520       353 total
```

```
┌──────────┬─────────────────────┬────────────────────────────────────┐
│ syscall  │        回数         │                意味                │
├──────────┼─────────────────────┼────────────────────────────────────┤
│ read     │ 11,066              │ ファイルからの読み込み             │
├──────────┼─────────────────────┼────────────────────────────────────┤
│ write    │ 11,068              │ 書き込み                           │
├──────────┼─────────────────────┼────────────────────────────────────┤
│ sendto   │ 11,067              │ ソケットへの送信                   │
├──────────┼─────────────────────┼────────────────────────────────────┤
│ sendfile │ 0（表に存在しない） │ ゼロコピー転送は一切使われていない │
└──────────┴─────────────────────┴────────────────────────────────────┘
```

```
┌──────────────────────────────┬─────┬───────────┬─────────────────┐
│                              │  n  │ mean time │ mean throughput │
├──────────────────────────────┼─────┼───────────┼─────────────────┤
│ コールド（毎回drop_caches）  │ 10  │ 0.3813s   │ 1,903.0 MB/s    │
├──────────────────────────────┼─────┼───────────┼─────────────────┤
│ ウォーム（キャッシュヒット） │ 99  │ 0.3381s   │ 2,152.9 MB/s    │
└──────────────────────────────┴─────┴───────────┴─────────────────┘
```

- ファイルから64KB読む→ソケットに書く を1セットにして725MBの動画ファイルを分割送信している
  - Node/Bunのデフォルトチャンクサイズ(64KB)とほぼ一致している
- OSがファイルをメモリにキャッシュしているからディスクI/Oの回数は減っているはず

## perf
計測実行時のコマンド.
```bash
wrk -t2 -c50 -d30s --timeout 60s http://localhost:3000/videos/1

perf stat -p <PID>
sudo perf stat -p <PID>
```

ユーザー空間を計測した結果メモ。
```❯ perf stat -p 724423

 Performance counter stats for process id '724423':

                 0      context-switches:u               #      0.0 cs/sec  cs_per_second
                 0      cpu-migrations:u                 #      0.0 migrations/sec  migrations_per_second
           155,806      page-faults:u                    #   1148.1 faults/sec  page_faults_per_second
        135,710.91 msec task-clock:u                     #      0.6 CPUs  CPUs_utilized
       563,084,608      branch-misses:u                  #      3.3 %  branch_miss_rate         (49.59%)
    17,260,908,375      branches:u                       #    127.2 M/sec  branch_frequency     (49.79%)
   108,817,089,597      cpu-cycles:u                     #      0.8 GHz  cycles_frequency       (66.64%)
    83,576,691,322      instructions:u                   #      0.8 instructions  insn_per_cycle  (50.42%)
    28,087,844,417      stalled-cycles-frontend:u        #     0.26 frontend_cycles_idle        (50.22%)

     217.213854586 seconds time elapsed
```
ユーザー空間+カーネル空間を計測した結果メモ。
```
 Performance counter stats for process id '727995':
    
         3,243,938      context-switches                 #  47906.4 cs/sec  cs_per_second
            74,411      cpu-migrations                   #   1098.9 migrations/sec  migrations_per_second
         1,175,008      page-faults                      #  17352.5 faults/sec  page_faults_per_second
         67,714.13 msec task-clock                       #      0.8 CPUs  CPUs_utilized
     2,801,127,723      branch-misses                    #      8.5 %  branch_miss_rate         (50.04%)
    33,120,343,602      branches                         #    489.1 M/sec  branch_frequency     (50.01%)
   310,675,409,859      cpu-cycles                       #      4.6 GHz  cycles_frequency       (66.86%)
   147,715,085,442      instructions                     #      0.5 instructions  insn_per_cycle  (49.96%)
   123,585,708,222      stalled-cycles-frontend          #     0.40 frontend_cycles_idle        (49.99%)

      82.080407594 seconds time elapsed
```

- context-switches: ユーザー空間⇔カーネル空間の往来数
- page-faults: マイナーフォルト + メジャーフォルト


システムコール単位の内訳の計測メモ。
```
 Summary of events:

 mi-scavenger (872158), 42943 events, 0.3%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               2841    216 23189.449     0.000     8.162    47.990      0.71%
   madvise            18635      0   333.229     0.001     0.018     0.420      1.42%


 HeapHelper (872184), 319103 events, 1.9%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              61600   1580 23008.139     0.000     0.374   105.726      1.83%
   sched_yield        97938      0   139.003     0.001     0.001     0.409      0.31%


 HeapHelper (872183), 326527 events, 2.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              62819   1717 22977.123     0.000     0.366   105.741      1.83%
   sched_yield       100435      0   142.401     0.001     0.001     0.315      0.26%


 HeapHelper (872182), 326968 events, 2.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              63591   1944 22967.874     0.000     0.361   105.719      1.83%
   sched_yield        99873      0   142.759     0.001     0.001     0.107      0.15%


 HeapHelper (872180), 338216 events, 2.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              64528   2095 22975.668     0.000     0.356   105.703      1.83%
   sched_yield       104558      0   148.129     0.001     0.001     0.101      0.15%


 HeapHelper (872181), 342371 events, 2.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              64637   2117 22960.435     0.000     0.355   105.711      1.84%
   sched_yield       106534      0   146.851     0.001     0.001     0.053      0.11%


 HeapHelper (872179), 350428 events, 2.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              64606   2094 22951.046     0.000     0.355   105.707      1.84%
   sched_yield       110579      0   154.059     0.001     0.001     0.084      0.11%


 HeapHelper (872178), 352407 events, 2.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              64086   2054 22943.358     0.000     0.358   105.691      1.83%
   sched_yield       112102      0   157.021     0.001     0.001     0.162      0.15%


 Bun Pool 13 (872171), 573138 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             157824   8457 22380.345     0.000     0.142    42.063      0.30%
   read               64390      0   530.995     0.001     0.008     0.225      0.24%
   write              64356      0    90.306     0.001     0.001     0.063      0.14%
   openat                 8      0     0.031     0.003     0.004     0.006     14.73%
   close                  5      0     0.013     0.002     0.003     0.004     10.13%


 Bun Pool 15 (872174), 576306 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             157990   8650 22367.824     0.000     0.142    42.059      0.30%
   read               65114      0   535.764     0.001     0.008     1.134      0.31%
   write              65055      0    92.532     0.001     0.001     0.045      0.11%
   openat                 6      0     0.040     0.003     0.007     0.012     19.13%
   close                  2      0     0.005     0.003     0.003     0.003      2.13%


 Bun Pool 14 (872173), 576439 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             157766   8503 22356.174     0.000     0.142    42.115      0.30%
   read               65248      0   540.156     0.001     0.008     0.206      0.22%
   write              65194      0    92.790     0.001     0.001     0.029      0.09%
   openat                 4      0     0.020     0.003     0.005     0.009     30.08%
   close                  1      0     0.002     0.002     0.002     0.002      0.00%


 Bun Pool 11 (872169), 581832 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             158602   8964 22340.343     0.000     0.141    41.856      0.30%
   read               66173      0   547.132     0.001     0.008     3.348      0.65%
   write              66128      0    94.948     0.001     0.001     0.152      0.18%
   openat                 7      0     0.044     0.003     0.006     0.010     17.09%
   close                  4      0     0.011     0.002     0.003     0.003      5.28%


 Bun Pool 9 (872167), 584515 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159232   9295 22342.030     0.000     0.140    41.876      0.30%
   read               66543      0   548.690     0.001     0.008     0.168      0.22%
   write              66472      0    95.269     0.001     0.001     0.076      0.13%
   openat                 6      0     0.032     0.003     0.005     0.007     11.26%
   close                  1      0     0.004     0.004     0.004     0.004      0.00%


 Bun Pool 12 (872170), 585522 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             158924   9126 22327.034     0.000     0.140    41.469      0.29%
   read               66944      0   553.314     0.001     0.008     0.162      0.22%
   write              66888      0    96.348     0.001     0.001     0.081      0.12%
   openat                 6      0     0.031     0.004     0.005     0.007     10.65%
   close                  1      0     0.003     0.003     0.003     0.003      0.00%


 Bun Pool 10 (872168), 587068 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159214   9207 22322.935     0.000     0.140    42.112      0.30%
   read               67193      0   556.215     0.001     0.008     0.170      0.22%
   write              67102      0    96.343     0.001     0.001     0.023      0.10%
   openat                 9      0     0.051     0.003     0.006     0.011     13.54%
   close                  1      0     0.003     0.003     0.003     0.003      0.00%


 Bun Pool 8 (872166), 587519 events, 3.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159468   9453 22329.706     0.000     0.140    42.126      0.30%
   read               67180      0   548.890     0.001     0.008     0.123      0.21%
   write              67104      0    96.713     0.001     0.001     0.029      0.10%
   openat                 6      0     0.024     0.003     0.004     0.006     12.34%
   close                  3      0     0.009     0.003     0.003     0.003      2.77%


 Bun Pool 4 (872162), 589751 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159452   9531 22312.776     0.000     0.140    41.449      0.30%
   read               67735      0   560.617     0.001     0.008     0.223      0.22%
   write              67685      0    98.535     0.001     0.001     0.023      0.09%
   openat                 7      0     0.033     0.003     0.005     0.007     12.75%
   close                  5      0     0.014     0.002     0.003     0.005     16.48%


 Bun Pool 5 (872163), 589818 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159349   9439 22315.496     0.000     0.140    41.957      0.30%
   read               67814      0   555.931     0.001     0.008     0.121      0.21%
   write              67743      0    99.120     0.001     0.001     0.042      0.10%
   openat                 7      0     0.032     0.003     0.005     0.007     13.29%
   close                  3      0     0.007     0.002     0.002     0.003     10.36%


 Bun Pool 7 (872165), 591405 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159971   9697 22318.137     0.000     0.140    41.995      0.30%
   read               67902      0   556.194     0.001     0.008     0.132      0.21%
   write              67840      0    98.960     0.001     0.001     0.027      0.10%
   openat                 5      0     0.026     0.004     0.005     0.007     10.69%
   close                  4      0     0.013     0.002     0.003     0.004     11.38%


 Bun Pool 6 (872164), 591962 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             159763   9719 22303.199     0.000     0.140    42.082      0.30%
   read               68137      0   566.257     0.001     0.008     0.205      0.22%
   write              68072      0    99.452     0.001     0.001     0.030      0.10%
   openat                 7      0     0.034     0.003     0.005     0.007     11.40%
   close                  7      0     0.019     0.002     0.003     0.003      4.41%


 Bun Pool 2 (872160), 594219 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             160172   9781 22299.184     0.000     0.139    42.008      0.30%
   read               68500      0   567.732     0.001     0.008     0.219      0.23%
   write              68440      0    99.644     0.001     0.001     0.024      0.09%
   openat                 5      0     0.029     0.003     0.006     0.008     16.72%
   close                  3      0     0.007     0.002     0.002     0.003      8.76%


 Bun Pool 1 (872159), 594624 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             160043   9847 22291.226     0.000     0.139    41.970      0.30%
   read               68663      0   565.368     0.001     0.008     0.137      0.21%
   write              68601      0   102.463     0.001     0.001     0.029      0.10%
   openat                 7      0     0.039     0.003     0.006     0.008     13.73%
   close                  2      0     0.005     0.003     0.003     0.003      2.03%


 Bun Pool 3 (872161), 595108 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             160294   9934 22295.638     0.000     0.139    42.155      0.30%
   read               68666      0   566.580     0.001     0.008     0.145      0.21%
   write              68617      0   104.287     0.001     0.002     3.297      3.16%
   openat                 6      0     0.041     0.005     0.007     0.011     13.67%
   close                  2      0     0.005     0.002     0.002     0.002      7.59%


 Bun Pool 0 (872157), 598241 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex             160672  10226 22275.984     0.000     0.139    42.071      0.30%
   read               69264      0   571.326     0.001     0.008     0.233      0.21%
   write              69196      0   103.734     0.001     0.001     0.026      0.10%
   openat                 4      0     0.022     0.004     0.006     0.007     11.92%
   close                  6      0     0.015     0.002     0.003     0.003      7.78%


 bun (872044), 4809509 events, 29.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   sendto           1075550      0 14488.014     0.002     0.013     1.785      0.02%
   futex            1185891   8172  2315.731     0.001     0.002     0.270      0.07%
   sched_yield       125674      0   170.297     0.001     0.001     0.144      0.14%
   epoll_pwait2        2454      0   101.974     0.000     0.042    43.459     59.84%
   pread64            14402      0    40.142     0.002     0.003     0.023      0.18%
   madvise               74      0     0.859     0.002     0.012     0.218     32.62%
   statx                100      0     0.377     0.003     0.004     0.008      2.65%
   epoll_ctl            182      0     0.353     0.001     0.002     0.005      2.18%
   accept4               56      4     0.328     0.003     0.006     0.018      4.85%
   recvfrom             102      0     0.257     0.002     0.003     0.006      2.67%
   clone                  7      0     0.143     0.015     0.020     0.030     11.24%
   setsockopt            52      0     0.083     0.001     0.002     0.003      2.46%
   close                  2      0     0.049     0.020     0.025     0.030     20.59%
   rt_sigprocmask        14      0     0.023     0.001     0.002     0.003     10.45%
   mmap                   1      0     0.016     0.016     0.016     0.016      0.00%
   sched_getaffinity        7      0     0.012     0.001     0.002     0.002      6.65%
```

- Bun poolというBunが用意したスレッドプールが実際の処理を移譲されている
  - メインスレッドでブロッキング処理を行うとメインスレッドのループが止まるためだと思われる
  - スレッドプールとイベントループ間のバッファ受け渡しというオーバーヘッドが存在する
- Bun poolの各スレッドが`read`を65,000 ~ 69,000回、`write`も同程度呼び出している
- `sendto`に時間の約半分を使っている


## docker
```bash
❯ ps aux | grep docker-proxy
root      872098  0.0  0.0 1672976 5816 ?        Sl   14:25   0:00 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 3000 -container-ip 172.19.0.2 -container-port 3000 -use-listen-fd
root      872111  2.7  0.0 3891232 9336 ?        Sl   14:25   0:17 /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 3000 -container-ip 172.19.0.2 -container-port 3000 -use-listen-fd
keisuke   874447  0.0  0.0 231356  2380 pts/4    S+   14:36   0:00 grep docker-proxy
```

- localhost:3000へのアクセスはブリッジネットワーク+NATを経由している
  - ネットワークオーバーヘッドが存在する

`docker-proxy`のtraceもメモ
```
❯ sudo perf trace -s -p 872111 -- sleep 30

 Summary of events:

 docker-proxy (872117), 51612 events, 0.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   nanosleep          24568      0 22166.537     0.024     0.902    20.123      1.88%
   futex               1039    221   155.812     0.000     0.150     3.702      7.14%
   sched_yield          154      0     1.296     0.001     0.008     0.285     33.01%
   pread64               23      0     0.140     0.005     0.006     0.009      3.36%
   sched_getaffinity       23      0     0.064     0.002     0.003     0.004      3.25%
   tgkill                 1      0     0.005     0.005     0.005     0.005      0.00%
   getpid                 1      0     0.001     0.001     0.001     0.001      0.00%


 docker-proxy (875035), 56404 events, 0.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               1313     42 17542.419     0.000    13.361  4633.577     31.18%
   splice             17223   5734   105.981     0.001     0.006     0.286      0.65%
   epoll_pwait         9467      0    45.840     0.001     0.005     1.117      5.77%
   sched_yield          201      0     0.937     0.001     0.005     0.106     14.94%


 docker-proxy (872730), 74137 events, 0.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               1879     42 14614.371     0.000     7.778  2934.873     29.79%
   splice             22908   7626   148.705     0.001     0.006     0.761      0.86%
   epoll_pwait        12116      0    57.154     0.001     0.005     1.044      4.16%
   sched_yield          173      0     1.439     0.001     0.008     0.432     32.59%


 docker-proxy (872125), 78804 events, 0.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               1735     30 10896.721     0.000     6.281  4633.790     43.64%
   splice             24017   7994   146.644     0.001     0.006     0.802      0.79%
   epoll_pwait        13492      0    58.991     0.001     0.004     1.708      4.76%
   sched_yield          166      0     1.153     0.001     0.007     0.151     17.96%


 docker-proxy (872744), 109637 events, 1.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               2373     39 16242.915     0.000     6.845  2431.962     23.87%
   splice             33750  11234   210.880     0.001     0.006     0.931      0.83%
   epoll_pwait        18497      0    85.674     0.001     0.005     1.337      4.01%
   sched_yield          208      0     0.870     0.001     0.004     0.169     21.55%


 docker-proxy (872736), 133171 events, 1.2%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               2694     42 13033.764     0.000     4.838  1166.629     18.78%
   splice             40779  13581   253.755     0.001     0.006     0.836      0.77%
   epoll_pwait        22905      0   107.547     0.001     0.005     1.332      3.28%
   sched_yield          213      0     1.810     0.001     0.008     0.356     25.96%


 docker-proxy (872124), 146319 events, 1.3%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               2455     38 14979.235     0.000     6.102  1951.728     21.14%
   splice             45463  15141   290.444     0.001     0.006     0.867      0.66%
   epoll_pwait        25046      0   114.971     0.001     0.005     2.801      4.45%
   sched_yield          209      0     1.331     0.001     0.006     0.198     21.56%


 docker-proxy (872731), 150110 events, 1.4%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               2892     46 17480.327     0.000     6.044  1951.755     19.71%
   splice             46202  15392   285.004     0.001     0.006     0.857      0.46%
   epoll_pwait        25693      0   106.490     0.001     0.004     0.959      2.55%
   sched_yield          216      0     2.517     0.001     0.012     0.484     29.03%
   connect                6      6     0.128     0.015     0.021     0.027      7.26%
   nanosleep              1      0     0.059     0.059     0.059     0.059      0.00%
   setsockopt            20      0     0.030     0.001     0.002     0.002      3.29%
   pipe2                  7      0     0.028     0.003     0.004     0.005      6.78%
   socket                 6      0     0.027     0.004     0.005     0.005      3.29%
   fcntl                  7      0     0.021     0.003     0.003     0.003      3.53%
   epoll_ctl              6      0     0.018     0.002     0.003     0.004      8.70%
   getsockopt             4      0     0.006     0.001     0.001     0.002      2.51%
   getsockname            4      0     0.006     0.001     0.001     0.002      6.32%
   getpeername            4      0     0.006     0.001     0.001     0.002      4.85%


 docker-proxy (872762), 160360 events, 1.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               3700     52 17426.890     0.000     4.710  2628.590     24.51%
   splice             49133  16364   317.744     0.001     0.006     1.034      0.80%
   epoll_pwait        27090      0   119.487     0.001     0.004     1.441      2.40%
   sched_yield          259      0     1.469     0.001     0.006     0.254     20.92%
   connect                1      1     0.031     0.031     0.031     0.031      0.00%
   socket                 1      0     0.007     0.007     0.007     0.007      0.00%
   epoll_ctl              1      0     0.004     0.004     0.004     0.004      0.00%
   pipe2                  1      0     0.004     0.004     0.004     0.004      0.00%
   fcntl                  1      0     0.003     0.003     0.003     0.003      0.00%


 docker-proxy (872750), 170136 events, 1.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               3515     57 17396.577     0.000     4.949  2628.602     23.73%
   splice             52101  17337   326.080     0.001     0.006     0.974      0.50%
   epoll_pwait        29084      0   137.629     0.001     0.005     2.099      3.17%
   sched_yield          310      0     1.732     0.001     0.006     0.240     17.80%
   nanosleep              2      0     0.120     0.059     0.060     0.061      1.31%
   setsockopt            30      0     0.051     0.001     0.002     0.002      2.64%
   pipe2                  8      0     0.045     0.004     0.006     0.010     11.94%
   fcntl                  8      0     0.030     0.003     0.004     0.005      5.25%
   getsockopt             6      0     0.012     0.002     0.002     0.002      5.61%
   getpeername            6      0     0.011     0.001     0.002     0.002      4.60%
   getsockname            6      0     0.010     0.002     0.002     0.002      5.40%


 docker-proxy (872751), 203488 events, 1.9%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4012     41 14659.858     0.000     3.654  2628.589     26.60%
   splice             62825  20917   389.308     0.001     0.006     0.933      0.51%
   epoll_pwait        34710      0   156.050     0.001     0.004     1.186      2.21%
   sched_yield          209      0     1.348     0.001     0.006     0.143     17.60%


 docker-proxy (872733), 206047 events, 1.9%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4180     53 17256.085     0.000     4.128  1951.698     17.60%
   splice             63393  21106   400.042     0.001     0.006     0.823      0.41%
   epoll_pwait        34819      0   162.954     0.001     0.005     1.907      2.57%
   sched_yield          233      0     2.550     0.001     0.011     1.064     42.37%
   setsockopt           250      0     0.330     0.001     0.001     0.002      0.89%
   accept4               51      1     0.202     0.002     0.004     0.027     11.79%
   epoll_ctl             51      0     0.122     0.002     0.002     0.005      4.14%
   getsockname           50      0     0.066     0.001     0.001     0.002      2.05%
   connect                1      1     0.038     0.038     0.038     0.038      0.00%
   socket                 1      0     0.004     0.004     0.004     0.004      0.00%


 docker-proxy (872745), 220570 events, 2.0%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4367     55 14694.079     0.000     3.365  1951.678     18.98%
   splice             67643  22518   433.962     0.001     0.006     3.249      0.85%
   epoll_pwait        38053      0   185.512     0.001     0.005     4.083      3.77%
   sched_yield          229      0     1.428     0.001     0.006     0.221     18.58%


 docker-proxy (872118), 225955 events, 2.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4526     54 16125.862     0.000     3.563  4217.269     29.08%
   splice             69800  23244   445.406     0.001     0.006     1.095      0.57%
   epoll_pwait        38405      0   175.017     0.001     0.005     1.244      2.33%
   sched_yield          254      0     1.445     0.001     0.006     0.268     22.92%


 docker-proxy (872732), 258243 events, 2.4%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4763     44 20174.737     0.000     4.236  4967.300     29.69%
   splice             79555  26481   494.845     0.001     0.006     0.477      0.29%
   epoll_pwait        44608      0   216.183     0.001     0.005     2.096      2.58%
   sched_yield          195      0     2.969     0.001     0.015     1.055     42.13%
   nanosleep              1      0     0.058     0.058     0.058     0.058      0.00%
   connect                2      2     0.051     0.016     0.026     0.035     37.49%
   socket                 2      0     0.009     0.004     0.005     0.005     11.98%
   pipe2                  1      0     0.008     0.008     0.008     0.008      0.00%
   setsockopt             5      0     0.008     0.001     0.002     0.002     10.18%
   epoll_ctl              2      0     0.007     0.003     0.003     0.004     14.57%
   fcntl                  1      0     0.004     0.004     0.004     0.004      0.00%
   getsockopt             1      0     0.001     0.001     0.001     0.001      0.00%
   getpeername            1      0     0.001     0.001     0.001     0.001      0.00%
   getsockname            1      0     0.001     0.001     0.001     0.001      0.00%


 docker-proxy (872739), 270931 events, 2.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               6182     71 14370.811     0.000     2.325  2628.645     22.11%
   splice             83337  27741   530.596     0.001     0.006     0.729      0.37%
   epoll_pwait        45693      0   225.181     0.001     0.005     3.583      3.03%
   sched_yield          254      0     1.636     0.001     0.006     0.404     26.46%
   clone3                 1      0     0.032     0.032     0.032     0.032      0.00%
   mmap                   1      0     0.013     0.013     0.013     0.013      0.00%
   madvise                1      0     0.007     0.007     0.007     0.007      0.00%
   rt_sigprocmask         4      0     0.006     0.001     0.001     0.002      5.65%


 docker-proxy (872121), 271166 events, 2.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               5399     56 16722.587     0.000     3.097  2628.595     20.05%
   splice             83853  27917   535.104     0.001     0.006     1.307      0.52%
   epoll_pwait        46069      0   222.976     0.001     0.005     2.719      2.87%
   sched_yield          275      0     1.197     0.001     0.004     0.115     15.69%


 docker-proxy (872743), 272907 events, 2.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               5302     66 17018.269     0.000     3.210  1951.689     18.25%
   splice             84590  28164   532.856     0.001     0.006     0.883      0.47%
   epoll_pwait        46290      0   205.022     0.001     0.004     1.969      2.44%
   sched_yield          275      0     1.396     0.001     0.005     0.222     18.94%
   nanosleep              1      0     0.060     0.060     0.060     0.060      0.00%
   pipe2                  2      0     0.009     0.004     0.005     0.005      9.80%
   fcntl                  2      0     0.007     0.004     0.004     0.004      0.42%


 docker-proxy (872756), 283311 events, 2.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               5424     56 13846.207     0.000     2.553  1951.679     18.84%
   splice             86842  28922   543.631     0.001     0.006     3.125      0.68%
   epoll_pwait        49132      0   229.450     0.001     0.005     1.263      1.93%
   sched_yield          276      0     1.073     0.001     0.004     0.082     12.62%


 docker-proxy (872741), 288878 events, 2.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4788     53 18695.619     0.000     3.905  2448.110     24.04%
   splice             88437  29446   548.528     0.001     0.006     0.852      0.43%
   epoll_pwait        51006      0   244.828     0.001     0.005     2.393      2.26%
   sched_yield          228      0     1.635     0.001     0.007     0.410     29.00%


 docker-proxy (872734), 300978 events, 2.8%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               4925     48 20608.657     0.000     4.184  4183.325     25.22%
   splice             93258  31050   577.338     0.001     0.006     0.753      0.28%
   epoll_pwait        52009      0   231.293     0.001     0.004     2.811      2.30%
   sched_yield          214      0     0.793     0.001     0.004     0.054     11.90%
   nanosleep              4      0     0.232     0.057     0.058     0.058      0.43%
   connect               10     10     0.211     0.015     0.021     0.031      8.82%
   pipe2                 13      0     0.054     0.003     0.004     0.009     10.12%
   fcntl                 13      0     0.044     0.003     0.003     0.006      6.77%
   socket                10      0     0.042     0.003     0.004     0.007      7.86%
   setsockopt            25      0     0.038     0.001     0.002     0.003      5.01%
   epoll_ctl             10      0     0.027     0.002     0.003     0.003      4.61%
   getsockopt             5      0     0.008     0.002     0.002     0.002      5.21%
   getpeername            5      0     0.008     0.001     0.002     0.002     11.27%
   getsockname            5      0     0.007     0.001     0.001     0.002      5.84%


 docker-proxy (872754), 313098 events, 2.9%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               6283     61 15846.639     0.000     2.522  1951.686     18.08%
   splice             96288  32064   601.354     0.001     0.006     0.800      0.40%
   epoll_pwait        53724      0   232.848     0.001     0.004     1.737      2.04%
   sched_yield          268      0     1.246     0.001     0.005     0.080     12.91%


 docker-proxy (872738), 319086 events, 2.9%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               6850     60 12622.638     0.000     1.843  1083.374     17.14%
   splice             97894  32570   614.025     0.001     0.006     1.033      0.52%
   epoll_pwait        54517      0   258.490     0.001     0.005     2.730      2.54%
   sched_yield          251      0     1.156     0.001     0.005     0.296     27.14%
   nanosleep              5      0     0.292     0.057     0.058     0.061      1.17%
   pipe2                  9      0     0.035     0.003     0.004     0.007     10.94%
   fcntl                  9      0     0.026     0.003     0.003     0.004      4.81%
   setsockopt            15      0     0.021     0.001     0.001     0.002      3.07%
   getsockopt             3      0     0.005     0.002     0.002     0.002      2.35%
   getpeername            3      0     0.004     0.001     0.001     0.001      2.42%
   getsockname            3      0     0.004     0.001     0.001     0.001      3.44%


 docker-proxy (872740), 331441 events, 3.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               6671     61 16828.872     0.000     2.523  2628.613     22.69%
   splice            101817  33758   615.695     0.001     0.006     1.007      0.38%
   epoll_pwait        56924      0   262.319     0.001     0.005     3.834      2.46%
   sched_yield          277      0     1.968     0.001     0.007     0.323     21.06%
   nanosleep              1      0     0.061     0.061     0.061     0.061      0.00%
   connect                1      1     0.041     0.041     0.041     0.041      0.00%
   setsockopt            20      0     0.033     0.001     0.002     0.002      4.49%
   pipe2                  6      0     0.028     0.003     0.005     0.009     17.56%
   fcntl                  6      0     0.020     0.003     0.003     0.005     10.24%
   getpeername            4      0     0.008     0.001     0.002     0.003     16.25%
   getsockopt             4      0     0.008     0.002     0.002     0.002      4.07%
   getsockname            4      0     0.007     0.001     0.002     0.002      6.04%
   socket                 1      0     0.006     0.006     0.006     0.006      0.00%
   epoll_ctl              1      0     0.004     0.004     0.004     0.004      0.00%


 docker-proxy (872758), 346962 events, 3.2%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               5838     61 16573.294     0.000     2.839  1951.676     17.34%
   splice            106615  35519   663.490     0.001     0.006     0.893      0.34%
   epoll_pwait        60747      0   271.372     0.001     0.004     1.793      1.77%
   sched_yield          295      0    34.631     0.001     0.117    33.244     95.98%


 docker-proxy (872742), 352124 events, 3.2%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               5525     38 18009.989     0.000     3.260  3001.575     23.11%
   splice            109122  36346   692.790     0.001     0.006     0.998      0.27%
   epoll_pwait        61217      0   279.162     0.001     0.005     3.122      2.32%
   sched_yield          212      0     1.074     0.001     0.005     0.191     21.24%


 docker-proxy (872747), 360090 events, 3.3%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               6901     63 16724.697     0.000     2.424  4633.580     30.35%
   splice            110444  36772   675.551     0.001     0.006     1.387      0.42%
   epoll_pwait        62401      0   280.552     0.001     0.004     1.343      1.70%
   sched_yield          249      0     1.522     0.001     0.006     0.234     22.70%
   nanosleep              4      0     0.234     0.057     0.058     0.061      1.58%
   connect                6      6     0.119     0.015     0.020     0.030     12.17%
   pipe2                  8      0     0.038     0.004     0.005     0.009     13.97%
   epoll_ctl              8      0     0.026     0.002     0.003     0.006     12.66%
   socket                 6      0     0.025     0.003     0.004     0.006     10.77%
   shutdown               2      1     0.024     0.002     0.012     0.022     81.54%
   fcntl                  8      0     0.024     0.003     0.003     0.004      4.90%
   setsockopt            15      0     0.021     0.001     0.001     0.002      3.94%
   close                  2      0     0.010     0.004     0.005     0.005      9.41%
   getsockopt             3      0     0.005     0.002     0.002     0.002      0.87%
   getsockname            3      0     0.004     0.001     0.001     0.002      5.37%
   getpeername            3      0     0.004     0.001     0.001     0.001      2.99%


 docker-proxy (872752), 390218 events, 3.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               7314     51 16623.857     0.000     2.273  2628.590     19.64%
   splice            119850  39908   731.292     0.001     0.006     1.031      0.36%
   epoll_pwait        67669      0   305.307     0.001     0.005     3.574      1.91%
   sched_yield          233      0     3.859     0.001     0.017     2.004     54.95%
   nanosleep              3      0     0.175     0.058     0.058     0.058      0.27%
   connect                4      4     0.126     0.019     0.031     0.057     27.89%
   pipe2                  7      0     0.033     0.003     0.005     0.008     13.82%
   setsockopt            20      0     0.029     0.001     0.001     0.002      3.17%
   socket                 4      0     0.024     0.004     0.006     0.010     26.56%
   fcntl                  7      0     0.022     0.002     0.003     0.004      6.76%
   epoll_ctl              4      0     0.015     0.003     0.004     0.005     16.18%
   getsockopt             4      0     0.006     0.001     0.002     0.002      6.78%
   getpeername            4      0     0.006     0.001     0.001     0.002      6.10%
   getsockname            4      0     0.005     0.001     0.001     0.002      3.85%


 docker-proxy (872749), 486206 events, 4.5%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               7356     62 18144.468     0.000     2.467  1635.291     15.85%
   splice            150017  49963   940.669     0.001     0.006     0.927      0.27%
   epoll_pwait        85467      0   375.415     0.001     0.004     1.935      1.57%
   sched_yield          286      0     1.832     0.001     0.006     0.200     17.91%


 docker-proxy (872737), 496794 events, 4.6%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               8952     71 20570.014     0.000     2.298  2448.100     19.78%
   splice            153396  51050   952.063     0.001     0.006     0.865      0.24%
   epoll_pwait        85769      0   379.623     0.001     0.004     1.622      1.57%
   sched_yield          298      0     1.559     0.001     0.005     0.098     14.48%
   nanosleep              1      0     0.059     0.059     0.059     0.059      0.00%
   connect                1      1     0.019     0.019     0.019     0.019      0.00%
   pipe2                  1      0     0.005     0.005     0.005     0.005      0.00%
   socket                 1      0     0.004     0.004     0.004     0.004      0.00%
   fcntl                  1      0     0.003     0.003     0.003     0.003      0.00%
   epoll_ctl              1      0     0.003     0.003     0.003     0.003      0.00%


 docker-proxy (872746), 504402 events, 4.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               9115     69 16199.642     0.001     1.777  1166.609     13.67%
   splice            154893  51569   942.336     0.001     0.006     0.846      0.29%
   epoll_pwait        87915      0   406.309     0.000     0.005     2.215      1.66%
   sched_yield          261      0     2.084     0.001     0.008     0.392     28.53%
   connect                4      4     0.107     0.016     0.027     0.045     24.78%
   nanosleep              1      0     0.059     0.059     0.059     0.059      0.00%
   setsockopt            20      0     0.033     0.001     0.002     0.003      5.34%
   pipe2                  5      0     0.021     0.003     0.004     0.005     10.29%
   epoll_ctl              5      0     0.021     0.002     0.004     0.006     14.71%
   shutdown               2      0     0.019     0.003     0.010     0.017     71.68%
   socket                 4      0     0.017     0.003     0.004     0.006     12.01%
   fcntl                  5      0     0.016     0.002     0.003     0.004      9.61%
   accept4                2      1     0.015     0.004     0.008     0.011     46.35%
   getsockname            4      0     0.006     0.001     0.002     0.002     10.58%
   getsockopt             3      0     0.005     0.001     0.002     0.002     11.97%
   getpeername            3      0     0.004     0.001     0.001     0.002     13.95%


 docker-proxy (872757), 505190 events, 4.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               7368     43 20584.727     0.000     2.794  1898.520     15.99%
   splice            155576  51820   950.129     0.001     0.006     0.652      0.18%
   epoll_pwait        89337      0   386.507     0.001     0.004     1.541      1.48%
   sched_yield          186      0     1.128     0.001     0.006     0.207     24.15%
   nanosleep              2      0     0.119     0.059     0.060     0.060      0.08%
   setsockopt            55      0     0.079     0.001     0.001     0.002      2.17%
   pipe2                 20      0     0.077     0.003     0.004     0.007      5.99%
   connect                3      3     0.067     0.016     0.022     0.034     25.49%
   fcntl                 20      0     0.061     0.002     0.003     0.005      4.41%
   getsockopt            11      0     0.017     0.001     0.002     0.002      3.58%
   getpeername           11      0     0.016     0.001     0.001     0.002      3.42%
   getsockname           11      0     0.015     0.001     0.001     0.002      2.39%
   socket                 3      0     0.012     0.003     0.004     0.005     10.79%
   epoll_ctl              3      0     0.010     0.002     0.003     0.005     25.84%


 docker-proxy (875043), 589180 events, 5.4%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               8772     85 20276.797     0.000     2.312  2628.625     19.43%
   splice            181419  60438  1111.971     0.001     0.006     0.829      0.22%
   epoll_pwait       104088      0   453.733     0.001     0.004     1.662      1.39%
   sched_yield          322      0     1.416     0.001     0.004     0.103     12.95%
   connect                3      3     0.064     0.015     0.021     0.031     23.67%
   nanosleep              1      0     0.059     0.059     0.059     0.059      0.00%
   socket                 3      0     0.015     0.003     0.005     0.008     30.95%
   pipe2                  2      0     0.010     0.004     0.005     0.006     17.96%
   epoll_ctl              3      0     0.008     0.002     0.003     0.004     15.29%
   setsockopt             5      0     0.007     0.001     0.001     0.002      7.25%
   fcntl                  2      0     0.006     0.003     0.003     0.003      6.81%
   getsockopt             1      0     0.001     0.001     0.001     0.001      0.00%
   getpeername            1      0     0.001     0.001     0.001     0.001      0.00%
   getsockname            1      0     0.001     0.001     0.001     0.001      0.00%


 docker-proxy (872748), 622335 events, 5.7%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex               9770     63 18885.597     0.000     1.933  4183.344     24.60%
   splice            192825  64211  1188.883     0.001     0.006     1.020      0.21%
   epoll_pwait       108298      0   479.976     0.001     0.004     2.238      1.61%
   sched_yield          267      0     2.686     0.001     0.010     0.849     35.36%
   connect                2      2     0.037     0.015     0.019     0.022     19.97%
   fcntl                  2      0     0.019     0.003     0.009     0.015     63.91%
   pipe2                  2      0     0.015     0.004     0.007     0.010     39.00%
   socket                 2      0     0.008     0.004     0.004     0.004      1.58%
   setsockopt             5      0     0.007     0.001     0.001     0.002      6.19%
   epoll_ctl              2      0     0.007     0.002     0.003     0.005     37.54%
   getpeername            1      0     0.001     0.001     0.001     0.001      0.00%
   getsockopt             1      0     0.001     0.001     0.001     0.001      0.00%
   getsockname            1      0     0.001     0.001     0.001     0.001      0.00%


 docker-proxy (872753), 631773 events, 5.8%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              11053     82 20045.082     0.000     1.814  2431.915     15.10%
   splice            194377  64741  1221.771     0.001     0.006     0.970      0.21%
   epoll_pwait       110053      0   512.024     0.001     0.005     4.054      1.55%
   sched_yield          356      0     2.032     0.001     0.006     0.256     18.02%
   connect                7      7     0.165     0.015     0.024     0.051     20.43%
   nanosleep              2      0     0.116     0.058     0.058     0.058      0.59%
   setsockopt            25      0     0.034     0.001     0.001     0.002      2.57%
   socket                 7      0     0.029     0.003     0.004     0.007     11.05%
   pipe2                  8      0     0.029     0.003     0.004     0.005      5.10%
   fcntl                  8      0     0.023     0.002     0.003     0.003      4.46%
   epoll_ctl              7      0     0.019     0.002     0.003     0.003      4.26%
   getsockopt             5      0     0.008     0.001     0.002     0.002      3.87%
   getsockname            5      0     0.007     0.001     0.001     0.002      5.30%
   getpeername            5      0     0.007     0.001     0.001     0.001      2.81%


 docker-proxy (872755), 657345 events, 6.1%

   syscall            calls  errors  total       min       avg       max       stddev
                                     (msec)    (msec)    (msec)    (msec)        (%)
   --------------- --------  ------ -------- --------- --------- ---------     ------
   futex              11971     93 16237.843     0.000     1.356  2431.894     17.59%
   splice            202508  67427  1261.485     0.001     0.006     1.026      0.24%
   epoll_pwait       113913      0   522.369     0.001     0.005     1.965      1.46%
   sched_yield          322      0     1.240     0.001     0.004     0.122     13.64%
```

- `read/write`ではなく`splice`を使っている
  - spliceの平均時間は短いが、回数が多い。これは一回に転送できるデータ量がパイプバッファのサイズに限定されるためだと思われる
- スレッドの数が多い


## TCPソケットオプション
```bash
sandbox/oca-sandbox on  main [!?]
❯ sudo perf trace -p 872044 -e setsockopt --duration 0 -- sleep 5
Password:
     0.000 ( 0.006 ms): bun/872044 setsockopt(fd: 302, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     0.379 ( 0.004 ms): bun/872044 setsockopt(fd: 302, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     0.634 ( 0.004 ms): bun/872044 setsockopt(fd: 302, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.238 ( 0.003 ms): bun/872044 setsockopt(fd: 305, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.513 ( 0.003 ms): bun/872044 setsockopt(fd: 309, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.616 ( 0.003 ms): bun/872044 setsockopt(fd: 311, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.732 ( 0.003 ms): bun/872044 setsockopt(fd: 315, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.882 ( 0.003 ms): bun/872044 setsockopt(fd: 319, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     2.987 ( 0.003 ms): bun/872044 setsockopt(fd: 323, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.141 ( 0.003 ms): bun/872044 setsockopt(fd: 328, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.304 ( 0.003 ms): bun/872044 setsockopt(fd: 331, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.462 ( 0.003 ms): bun/872044 setsockopt(fd: 335, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.554 ( 0.003 ms): bun/872044 setsockopt(fd: 339, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.656 ( 0.003 ms): bun/872044 setsockopt(fd: 343, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.766 ( 0.003 ms): bun/872044 setsockopt(fd: 347, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.866 ( 0.003 ms): bun/872044 setsockopt(fd: 351, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     3.956 ( 0.003 ms): bun/872044 setsockopt(fd: 355, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.066 ( 0.004 ms): bun/872044 setsockopt(fd: 359, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.163 ( 0.003 ms): bun/872044 setsockopt(fd: 363, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.256 ( 0.003 ms): bun/872044 setsockopt(fd: 367, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.336 ( 0.002 ms): bun/872044 setsockopt(fd: 371, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.418 ( 0.002 ms): bun/872044 setsockopt(fd: 376, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.506 ( 0.002 ms): bun/872044 setsockopt(fd: 379, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.583 ( 0.003 ms): bun/872044 setsockopt(fd: 383, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.656 ( 0.002 ms): bun/872044 setsockopt(fd: 387, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.754 ( 0.003 ms): bun/872044 setsockopt(fd: 391, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.826 ( 0.002 ms): bun/872044 setsockopt(fd: 395, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.905 ( 0.003 ms): bun/872044 setsockopt(fd: 398, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     4.996 ( 0.003 ms): bun/872044 setsockopt(fd: 400, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.087 ( 0.003 ms): bun/872044 setsockopt(fd: 406, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.162 ( 0.002 ms): bun/872044 setsockopt(fd: 407, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.232 ( 0.002 ms): bun/872044 setsockopt(fd: 409, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.291 ( 0.002 ms): bun/872044 setsockopt(fd: 411, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.351 ( 0.002 ms): bun/872044 setsockopt(fd: 413, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.414 ( 0.002 ms): bun/872044 setsockopt(fd: 415, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.472 ( 0.002 ms): bun/872044 setsockopt(fd: 417, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.544 ( 0.002 ms): bun/872044 setsockopt(fd: 419, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.620 ( 0.003 ms): bun/872044 setsockopt(fd: 421, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.697 ( 0.002 ms): bun/872044 setsockopt(fd: 424, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.760 ( 0.002 ms): bun/872044 setsockopt(fd: 425, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.817 ( 0.002 ms): bun/872044 setsockopt(fd: 427, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.878 ( 0.002 ms): bun/872044 setsockopt(fd: 429, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     5.939 ( 0.002 ms): bun/872044 setsockopt(fd: 431, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.008 ( 0.002 ms): bun/872044 setsockopt(fd: 433, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.073 ( 0.002 ms): bun/872044 setsockopt(fd: 435, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.141 ( 0.003 ms): bun/872044 setsockopt(fd: 437, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.207 ( 0.002 ms): bun/872044 setsockopt(fd: 439, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.290 ( 0.003 ms): bun/872044 setsockopt(fd: 441, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.364 ( 0.003 ms): bun/872044 setsockopt(fd: 443, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.438 ( 0.002 ms): bun/872044 setsockopt(fd: 445, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.509 ( 0.003 ms): bun/872044 setsockopt(fd: 448, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
     6.573 ( 0.002 ms): bun/872044 setsockopt(fd: 449, level: TCP, optname: 1, optval: 0x7ffc620b6100, optlen: 4) = 0
```

- ソケットバッファサイズ、ウィンドウサイズスケーリングなどを試してみるといいかも


