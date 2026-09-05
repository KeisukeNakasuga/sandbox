(ns grokking.threaded-pizza-server
  (:require [clojure.string :as str])
  (:import [java.net ServerSocket Socket]))

(def buffer-size 1024)
(def port 12345)

(defn serve
  [^Socket conn]
  (println "Connected to" (.getRemoteSocketAddress conn)
           "on" (.getName (Thread/currentThread)))
  (try
    (let [in  (.getInputStream conn)
          out (.getOutputStream conn)
          buf (byte-array buffer-size)]
      (loop []
        (let [n (.read in buf)]  ; クライアントが何か送るまでここで止まる
          (when (pos? n)
            (let [data     (String. buf 0 n)
                  response (try
                             (let [order (Long/parseLong (str/trim data))]
                               (str "Thank you for ordering " order " pizzas!\n"))
                             (catch NumberFormatException _
                               "Wrong number of pizzas, please try again\n"))]
              (println "Sending message to" (.getRemoteSocketAddress conn))
              (.write out (.getBytes response))
              (.flush out)
              (recur))))))
    (finally
      (println "Connection with" (.getRemoteSocketAddress conn) "has been closed")
      (.close conn))))

(defn start []
  (with-open [server-socket (ServerSocket. port)]
    (println "Server listening for incoming connections")
    (loop []
      (let [conn (.accept server-socket)]  ; ブロッキングIOなので、新しい接続があるまでここで止まる
        (println "Client connection request from" (.getRemoteSocketAddress conn))
        (.start (Thread. #(serve conn)))  ; 都度スレッドを作成
        ; (future (serve conn))  ; スレッドプールからスレッドを取得
      (recur)))))

(defn -main [& _] (start))
