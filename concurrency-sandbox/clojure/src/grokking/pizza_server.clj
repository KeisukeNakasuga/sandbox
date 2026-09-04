(ns grokking.pizza-server
  (:require [clojure.string :as str])
  (:import  [java.net ServerSocket Socket]))

(def buffer-size 1024)
(def port 12345)

(defn serve
  [^Socket conn]
  (try
    (let [in  (.getInputStream conn)
          out (.getOutputStream conn)
          buf (byte-array buffer-size)]
      (loop []
        (let [n (.read in buf)]
          (when (pos? n)
            (let [data     (String. buf 0 n)
                  response (try
                             (let [order (Long/parseLong (str/trim data))]
                               (str "Thank you for ordering " order " pizzas!¥n"))
                             (catch NumberFormatException _
                               "Wrong number of pizzas, please try again¥n"))]
              (println "Sending message to" (.getRemoteSocketAddress conn))
              (.write out (.getBytes response))
              (.flush out)
              (recur))))))
    (finally
      (println "Connection with" (.getRemoteSocketAddress conn) "has been closed")
      (.close conn))))

(defn start []
  (with-open [server (ServerSocket. port)]
    (println "Server listing for incoming connestions")
    (loop []
      (let [conn (.accept server)]
        (println "Connected to" (.getRemoteSocketAddress conn))
        (serve conn))
      (recur))))

(defn -main [& _] (start))
