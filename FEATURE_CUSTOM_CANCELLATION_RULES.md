# Customizable Cancellation and Credit Recovery Rules

## Overview

This feature introduces advanced configurability for Space Administrators, allowing them to define specific constraints around class cancellations and credit recovery. The feature addresses common business rules that require spaces to control when students can cancel without penalty, when credits expire, and the maximum number of credits a student can accumulate.

## Key Capabilities

1. **Max Credits to Recover (`max_credits_to_recover`)**:
   Administrators can define a strict ceiling on the number of non-expired "recoverable credits" a student can possess. If a student attempts to cancel a class that would exceed this capacity, the app gracefully intervenes with a clear warning. The system empowers the student to still proceed with their cancellation seamlessly, ensuring that they simply forfeit the extra credit without encountering frustrating errors or blocks.

2. **Credits Expiration Period (`credits_expiration_days`)**:
   Credits accumulated from cancelled classes originally had a hardcoded expiration of 8 weeks. Administrators can now input an arbitrary number of days that a credit will remain valid after being generated.

3. **Cancellation Penalty Window (`hours_to_cancel_without_penalty`)**:
   Administrators can specify the minimum number of hours before a scheduled class within which the student can cancel without losing their credit. If a student attempts to cancel closer to the class than this time threshold, they will not receive a recoverable credit (and will be warned appropriately before confirming).

## Use Cases for Marketing and Social Media

- **"Your Space, Your Rules"**: Highlight how administrators can finally configure the exact business logic they need, without being bound to one-size-fits-all defaults.
- **Improved Student Fairness**: By capping the total accumulated credits, academies can encourage consistent attendance rather than allowing students to hoard unused credits indefinitely.
- **Customized Expiration Tiers**: Whether a space operates on monthly or bi-monthly rhythms, the expiration window can be adjusted to perfectly align with their subscription and payment models.
