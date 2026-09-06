; スレッドはmainの1本
; スレッド内にclientsを持ち、それを経由してソケットにアクセスする
; loop単位でclientsに対して新しいメッセージがあるか聞いて回る
; これを可能にするのはノンブロッキングIO

(ns grokking.busy-wait-pizza
  (:import [java.net InetSocketAddress]
           [java.nio ByteBuffer]
           [java.nio.channels ServerSocketChannel SocketChannel] )
  (:require [clojure.string :as str]))

(def address "0.0.0.0")
(def port 12345)
(def clients (atom #{}))

(defn serve
  [^SocketChannel conn]
  (let [buf (ByteBuffer/allocate 1024)
        n   (.read conn buf)]
    (cond
      (pos? n)
      (let [bs (byte-array n)]
        (.flip buf)
        (.get buf bs)
        (let [data (String. bs)
              res (try
                    (let [order (Long/parseLong (str/trim data))]
                      (str "Thank you for ordering " order " pizzas!\n"))
                    (catch NumberFormatException _
                      "Wrong number of pizzas, please try again\n"))]
          (println "Sending message to " (.getRemoteAddress conn))
          (.write conn (ByteBuffer/wrap (.getBytes res)))))
      (neg? n)
      (do
        (println "Sending with " (.getRemoteAddress conn) "has been closed")
        (swap! clients disj conn)
        (.close conn))
      :else nil)))

(defn start []
  (with-open [ch (doto (ServerSocketChannel/open)
                   (.bind (InetSocketAddress. address port))
                   (.configureBlocking false))]
    (println "Server listening for incoming connections")
    (loop []
      (when-let [conn (.accept ch)]
        (.configureBlocking conn false)
        (swap! clients conj conn))
      (doseq [conn @clients]
        (serve conn))
      (recur))))

(defn -main [& _] (start))
