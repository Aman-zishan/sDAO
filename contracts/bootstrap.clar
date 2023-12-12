
;; title: bootstrap
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .proposal-trait.proposal-trait)

;; constants
;;
(define-constant ERR_INSUFFICIENT_BALANCE (err u2001))
;; 1M STX for grants allocation
(define-constant grant-fund u1000000000000)

;; token definitions
;; 

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .core set-extension .membership-token true))
        (try! (contract-call? .core set-extension .proposal-voting true))
        (try! (contract-call? .core set-extension .proposal-submission true))
        (try! (contract-call? .core set-extension .treasury true))

        ;; fund treasury with 1M STX, further treasury refills can be done via proposals
        ;; the core contract should be having 1M STX balance
        (asserts! (>= (stx-get-balance tx-sender) grant-fund) ERR_INSUFFICIENT_BALANCE)
        (try! (stx-transfer? grant-fund .core .treasury))


		;; Mint initial token supply.
        (try! (contract-call? .membership-token mint u1000 sender))

        (try! (contract-call? .membership-token mint u1000 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5))
        (try! (contract-call? .membership-token mint u1000 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG))
        (try! (contract-call? .membership-token mint u1000 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC))
        (try! (contract-call? .membership-token mint u1000 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND))
        (try! (contract-call? .membership-token mint u1000 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB))
        (try! (contract-call? .membership-token mint u1000 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0))
        (try! (contract-call? .membership-token mint u1000 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP))
        (try! (contract-call? .membership-token mint u1000 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ))
        (try! (contract-call? .membership-token mint u1000 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6))

		(print "DAO initialised Successfully!")
		(ok true)
	)
)
