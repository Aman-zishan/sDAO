
;; title: milestone-extension-proposal
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .proposal-trait.proposal-trait)

;; token definitions
;; 

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .core set-extension .milestone-extension true))
        (ok true)
	)
)

