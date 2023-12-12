
;; title: treasury
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .extension-trait.extension-trait)

;; token definitions
;; 

;; constants
;;
(define-constant ERR_UNAUTHORIZED (err u2000))
(define-constant ERR_INSUFFICIENT_BALANCE_IN_TREASURY (err u2001))

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (is-dao-or-extension)
  (ok (asserts! (or (is-eq tx-sender .core) (contract-call? .core is-extension contract-caller)) ERR_UNAUTHORIZED))
)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (transfer-stx (amount uint) (recipient principal))
  (begin
    (try! (is-dao-or-extension))
    (asserts! (>= (as-contract (stx-get-balance tx-sender)) amount) ERR_INSUFFICIENT_BALANCE_IN_TREASURY)
    (as-contract (try! (stx-transfer? amount tx-sender recipient)))
    (ok true)
  )
)

(define-public (callback (sender principal) (memo (buff 34)))
  (ok true)
)

;; read only functions
;;

;; private functions
;;

