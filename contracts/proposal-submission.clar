
;; title: proposal-submission
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .extension-trait.extension-trait)
(use-trait proposal-trait .proposal-trait.proposal-trait)

;; token definitions
;; 

;; constants
;;
(define-constant ERR_UNAUTHORIZED (err u3000))
(define-constant ERR_UNKNOWN_PARAMETER (err u3001))

;; data vars
;;

;; data maps
;;
(define-map parameters (string-ascii 34) uint)

;; public functions
;;


(define-public (is-dao-or-extension)
  (ok (asserts! (or (is-eq tx-sender .core) (contract-call? .core is-extension contract-caller)) ERR_UNAUTHORIZED))
)

(define-public (propose (proposal <proposal-trait>) (title (string-ascii 50)) (description (string-utf8 500)))
  (begin
    (contract-call? .proposal-voting add-proposal
      proposal
      {
        start-block-height: block-height,
        end-block-height: (+ block-height (try! (get-parameter "proposal-duration"))),
        proposer: tx-sender,
        title: title,
        description: description
      }
    )
  )
)

(define-public (callback (sender principal) (memo (buff 34)))
  (ok true)
)

;; read only functions
;;
(define-read-only (get-parameter (parameter (string-ascii 34)))
  (ok (unwrap! (map-get? parameters parameter) ERR_UNKNOWN_PARAMETER))
)

;; private functions
;;

