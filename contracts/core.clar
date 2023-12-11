
;; title: core
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait proposal-trait .proposal-trait.proposal-trait)
(use-trait extension-trait .extension-trait.extension-trait)

;; token definitions
;; 

;; constants
;;
(define-constant ERR_UNAUTHORIZED (err u1000))
(define-constant ERR_ALREADY_EXECUTED (err u1001))
(define-constant ERR_INVALID_EXTENSION (err u1002))

;; data vars
;;
(define-data-var executive principal tx-sender)

;; data maps
;;
(define-map executedProposals principal uint)
(define-map extensions principal bool)

;; public functions
;;
(define-public (construct (proposal <proposal-trait>))
  (let
    (
      (sender tx-sender)
    )
    (asserts! (is-eq sender (var-get executive)) ERR_UNAUTHORIZED)
    (var-set executive (as-contract tx-sender))
    (as-contract (execute proposal sender))
  )
)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (set-extension (extension principal) (enabled bool))
  (begin
    (try! (is-self-or-extension))
    (print {event: "extension", extension: extension, enabled: enabled})
    (ok (map-set extensions extension enabled))
  )
)

(define-public (execute (proposal <proposal-trait>) (sender principal))
  (begin
    (try! (is-self-or-extension))
    (asserts! (map-insert executedProposals (contract-of proposal) block-height) ERR_ALREADY_EXECUTED)
    (print {event: "execute", proposal: proposal})
    (as-contract (contract-call? proposal execute sender))
  )
)

(define-public (request-extension-callback (extension <extension-trait>) (memo (buff 34)))
  (let
    (
      (sender tx-sender)
    )
    (asserts! (is-extension contract-caller) ERR_INVALID_EXTENSION)
    (asserts! (is-eq contract-caller (contract-of extension)) ERR_INVALID_EXTENSION)
    (as-contract (contract-call? extension callback sender memo))
  )
)

;; read only functions
;;
(define-read-only (is-extension (extension principal))
  (default-to false (map-get? extensions extension))
)

(define-read-only (executed-at (proposal <proposal-trait>))
  (map-get? executedProposals (contract-of proposal))
)

;; private functions
;;
(define-private (is-self-or-extension)
  (ok (asserts! (or (is-eq tx-sender (as-contract tx-sender)) (is-extension contract-caller)) ERR_UNAUTHORIZED))
)



