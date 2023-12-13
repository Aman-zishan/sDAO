
;; title: membership-token
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .extension-trait.extension-trait)

;; token definitions
;; 
(define-fungible-token sGrant)

;; constants
;;
(define-constant ERR_UNAUTHORIZED (err u2000))
(define-constant ERR_NOT_TOKEN_OWNER (err u2001))
(define-constant ERR_MEMBERSHIP_LIMIT_REACHED (err u2002))

;; data vars
;;
(define-data-var tokenName (string-ascii 32) "sGrant")
(define-data-var tokenSymbol (string-ascii 10) "SGT")
(define-data-var tokenUri (optional (string-utf8 256)) none)
(define-data-var tokenDecimals uint u6)

;; data maps
;;

;; public functions
;;

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (mint (amount uint) (recipient principal))
  (begin
    (try! (is-dao-or-extension))
    (ft-mint? sGrant amount recipient)
  )
)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (burn (amount uint) (owner principal))
  (begin
    (try! (is-dao-or-extension))
    (ft-burn? sGrant amount owner)
  )
)

(define-public (is-dao-or-extension)
  (ok (asserts! (or (is-eq tx-sender .core) (contract-call? .core is-extension contract-caller)) ERR_UNAUTHORIZED))
)

(define-public (callback (sender principal) (memo (buff 34)))
  (ok true)
)

;; read only functions
;;
(define-read-only (get-name)
  (ok (var-get tokenName))
)

(define-read-only (get-symbol)
  (ok (var-get tokenSymbol))
)

(define-read-only (get-decimals)
  (ok (var-get tokenDecimals))
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance sGrant who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply sGrant))
)

(define-read-only (get-token-uri)
  (ok (var-get tokenUri))
)

;; private functions
;;


