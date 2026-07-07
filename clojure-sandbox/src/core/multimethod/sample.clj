(ns core.multimethod.sample)

(defstruct account :id :tag :balance)

(def test-savings
  (struct account 1 ::Savings 100M))
(def test-checkings
  (struct account 2 ::Checking 250M))

(defmulti interest-rate :tag)
(defmethod interest-rate ::Checking [_] 0M)
(defmethod interest-rate ::Savings [_] 0.05M)

(defmulti account-level :tag)
(defmethod account-level ::Checking [acct]
  (if (>= (:balance acct) 5000) ::Premium ::Basic))
(defmethod account-level ::Savings [acct]
  (if (>= (:balance acct) 1000) ::Premium ::Basic))

(defmulti service-charge
  (fn [acct] [(account-level acct) (:tag acct)]))
