(define-map grants
  principal
  { milestones: (list 10 { id: uint, start-height: uint, end-height: uint, amount: uint }) }
)

(define-data-var search-index uint u0)

;; #[allow(unchecked_params)]
;; #[allow(unchecked_data)]
(define-public (set-milestone (principal principal) (milestone { id: uint, start-height: uint, end-height: uint, amount: uint }))
  (let ((existing-milestones (get-milestones principal)))
        (map-set grants
          principal
          { milestones: (unwrap-panic (as-max-len? (append existing-milestones milestone) u10)) }
        )
      (ok true)
  ) 
)

(define-private (find-milestone (milestone { id: uint, start-height: uint, end-height: uint, amount: uint })
                                (state { found: (optional { id: uint, start-height: uint, end-height: uint, amount: uint }), id: uint }))
  (if (is-eq (get id milestone) (get id state))
    { found: (some milestone), id: (get id state) }
    state
  )
)

(define-read-only (get-milestone (principal principal) (id uint))
  (get found (fold find-milestone (get-milestones principal) { found: none, id: id }))
)

(define-read-only (get-milestones (principal principal))
  (default-to (list) (get milestones (map-get? grants principal)))
)











