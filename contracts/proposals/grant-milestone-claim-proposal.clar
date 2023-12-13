
;; title: grant-milestone-claim-proposal
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

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .milestone-extension claim (as-contract .grant-proposal) u1 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5))
        (ok true)
	)
)

;; read only functions
;;

;; private functions
;;

