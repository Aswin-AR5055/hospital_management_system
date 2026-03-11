## Architecture  


                ┌─────────────────────┐
                │   PostgreSQL DB     │
                │  (Hospital Server)  │
                └──────────┬──────────┘
                           │
                    Django + DRF API
                           │
                ┌──────────┴──────────┐
                │   Hospital Server   │
                │  (One Computer)     │
                └──────────┬──────────┘
                           │
                    LAN Router / Switch
            ┌──────────────┼──────────────┐
            │              │              │
     Reception PC     Doctor PC      Doctor PC
       (React)          (React)         (React)

---