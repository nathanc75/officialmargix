

## Remove Restaurant Address Field from Signup

### Summary
Remove the "Restaurant Address" input field from the signup form to align with the updated business focus on financial document scanning for any business type, not just restaurants.

### Changes Required

**File: `src/pages/Signup.tsx`**

1. **Remove the `restaurantAddress` state variable** (line 15)
   - Delete: `const [restaurantAddress, setRestaurantAddress] = useState("");`

2. **Remove the Restaurant Address form field** (lines 141-153)
   - Delete the entire `<div className="space-y-1">` block containing the Restaurant Address input

### Technical Details

The following code block will be removed:

```tsx
<div className="space-y-1">
  <Label htmlFor="restaurantAddress" className="text-foreground text-base">Restaurant Address</Label>
  <div className="relative">
    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <Input
      id="restaurantAddress"
      placeholder="123 Main St, Seattle, WA 98101"
      value={restaurantAddress}
      onChange={(e) => setRestaurantAddress(e.target.value)}
      className="pl-12 h-12 text-base bg-background/50 border-border focus:border-primary"
      required
    />
  </div>
</div>
```

The `MapPin` icon import can also be removed from the imports since it will no longer be used.

### Result
The signup form will have four fields instead of five:
- Full Name
- Restaurant Name (consider renaming to "Business Name" in a future update)
- Work Email
- Password

