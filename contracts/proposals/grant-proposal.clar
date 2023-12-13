
;; title: grant-proposal
;; version:
;; summary: Test grant proposal
;; description: This proposal should contain all the details of the grant and should call the milestone extension
;; to set two milestones, claiming is done via a new proposal when the end block height is reached

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
		(try! (contract-call? .milestone-extension set-milestone (as-contract tx-sender) {id: u1, start-height: block-height, end-height: (+ block-height u1440), amount: u100000000} ))
        (try! (contract-call? .milestone-extension set-milestone (as-contract tx-sender) {id: u2, start-height: (+ block-height u2880), end-height: u4320, amount: u100000000} ))
        (ok true)
	)
)

;; read only functions
;;

;; private functions
;;

