(ns core.state.state)

;; 変更可能なデータは ref を使う
(def current-track (ref "Mars, the Bringer of War"))

;; ref の中身を読み出すには deref を使う
(deref current-track)
;; @マクロでderefを省略もできる。
@current-track

;; 参照が指し示している先を変更する場合は ref-set を使用する
;; トランザクションで包んで参照を変更する例
(dosync (ref-set current-track "Venus, the Bringer of Peace"))

(def current-composer (ref "Holst"))

;; トランザクションで囲むことで片方の変数だけが更新されないという状態を避けられる
;; ClojureのSTMはACIを提供する
(dosync
  (ref-set current-track "Credo")
  (ref-set current-composer "Byrd"))

(def counter (ref 0))
(defn next-counter [] (dosync (alter counter inc)))
(next-counter)
(next-counter)

(def validate-message-list
  (partial every? #(and (:sender %) (:text %))))
(def message (ref () :validator validate-message-list))

(def current-track2 (atom "Venus, the Bringer of Peace"))

(def counter2 (agent 0))
(send counter2 inc)
@counter2

(def backup-agent (agent "output/message-backup.clj"))
(defn add-message-with-backup [msg]
  (dosync
    (let [snapshot (commute message conj msg)]
      (send-off backup-agent (fn [filename]
                               (spit filename snapshot)
                               filename))
      snapshot)))
