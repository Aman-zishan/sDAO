
;; title: milestone-extension
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
(define-constant ERR_BLOCK_HEIGHT_NOT_REACHED (err u3001))
(define-constant ERR_NO_MILESTONE_FOUND (err u3002))

;; data vars
;;

;; data maps
;;
(define-map grants
  principal
  { milestones: (list 10 { id: uint, start-height: uint, end-height: uint, amount: uint }) }
)

;; Internal DAO functions
;;
(define-public (is-dao-or-extension)
	(ok (asserts! (or (is-eq tx-sender .core) (contract-call? .core is-extension contract-caller)) ERR_UNAUTHORIZED))
)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (set-milestone (proposal principal) (milestone { id: uint, start-height: uint, end-height: uint, amount: uint }))
  (let ((existing-milestones (get-milestones proposal)))
        (try! (is-dao-or-extension))

        (map-set grants
          proposal
          { milestones: (unwrap-panic (as-max-len? (append existing-milestones milestone) u10)) }
        )

      (ok true)
  ) 
)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (claim (proposal principal) (milestone-id uint) (recipient principal))
  (let 
    (
      (milestone (unwrap! (get-milestone proposal milestone-id) ERR_NO_MILESTONE_FOUND))
      (end-height (get end-height milestone))
      (amount (get amount milestone))

    )
    (try! (is-dao-or-extension))
    ;; checks if the milestone end-height is reached
    (asserts! (> block-height end-height) ERR_BLOCK_HEIGHT_NOT_REACHED)
    ;; transfers the STX funds to recipient
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (ok true)
  )
)

;; public functions
;;

(define-public (callback (sender principal) (memo (buff 34)))
    (ok true)
)

;; read only functions
;;
(define-read-only (get-milestone (proposal principal) (id uint))
  (get found (fold find-milestone (get-milestones proposal) { found: none, id: id }))
)

(define-read-only (get-milestones (proposal principal))
  (default-to (list) (get milestones (map-get? grants proposal)))
)

;; private functions
;;

(define-private (find-milestone 
    (milestone { id: uint, start-height: uint, end-height: uint, amount: uint })
    (state { found: (optional { id: uint, start-height: uint, end-height: uint, amount: uint }), id: uint })
    )

    (if (is-eq (get id milestone) (get id state))
      { found: (some milestone), id: (get id state) }
      state
    )
)