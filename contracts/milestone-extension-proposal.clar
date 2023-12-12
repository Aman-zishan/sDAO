
;; title: milestone-extension-proposal
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .proposal-trait.proposal-trait)

;; token definitions
;; 

;; constants
;;
(define-constant ERR_INSUFFICIENT_BALANCE (err u2001))
;; 1M STX for grants allocation
(define-constant grant-fund u1000000000000)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .core set-extension .milestone-extension true))
        ;; fund extension with 1M STX, further refills can be done via proposals
        ;; the core contract should be having 1M STX balance
        (asserts! (>= (stx-get-balance tx-sender) grant-fund) ERR_INSUFFICIENT_BALANCE)
        (try! (stx-transfer? grant-fund .core .milestone-extension))
        (ok true)
	)
)

