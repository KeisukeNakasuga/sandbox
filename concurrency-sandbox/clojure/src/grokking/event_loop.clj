(ns grokking.event-loop)

(def events (atom clojure.lang.PersistentQueue/EMPTY))

(defn make-event
  ([ev-name action] (make-event ev-name action nil))
  ([ev-name action next-event] {:name ev-name :action action :next next-event}))

(defn execute-action [event]
  ((:action event) event)
  (when-let [nx (:next event)]
    (swap! events conj nx)))

(defn register-event [event]
  (swap! events conj event))

(defn run-forever []
  (println "Queue running with" (count @events) "events")
  (loop []
    (when-let [event (peek @events)]
      (swap! events pop)
      (execute-action event))
    (recur)))

(defn knock [event]
  (println (:name event))
  (Thread/sleep 1000))

(defn who [event]
  (println (:name event))
  (Thread/sleep 1000))

(def replying (make-event "Who's there?" who))
(def knocking (make-event "Knock-kncok" knock replying))

(defn -main [& _]
  (register-event knocking)
  (register-event knocking)
  (run-forever))
