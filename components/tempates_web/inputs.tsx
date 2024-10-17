import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//https://origin-ui-alpha.vercel.app/

//Simple input
export  function Input01() {
  return (
    <div className="space-y-2">
      <Label htmlFor="input-01">Simple input</Label>
      <Input id="input-01" placeholder="Email" type="email" />
    </div>
  );
}



//Required input *
export  function Input02() {
  return (
    <div className="space-y-2">
      <Label htmlFor="input-02">
        Required input <span className="text-destructive">*</span>
      </Label>
      <Input id="input-02" placeholder="Email" type="email" required />
    </div>
  );
}

//Input with helper text
export default function Input03() {
  return (
    <div className="space-y-2">
      <Label htmlFor="input-03">Input with helper text</Label>
      <Input id="input-03" placeholder="Email" type="email" />
      <p
        className="mt-2 text-xs text-muted-foreground"
        role="region"
        aria-live="polite"
      >
        We won&apos;t share your email with anyone
      </p>
    </div>
  );
}
//Input with hint
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input04() {
  return (
    <>
      <div className="mb-2 flex justify-between gap-1">
        <Label htmlFor="input-04" className="mb-0">
          Input with hint
        </Label>
        <span className="text-sm text-muted-foreground">Optional</span>
      </div>
      <Input id="input-04" placeholder="Email" type="email" />
    </>
  );
}

//import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input05() {
  return (
    <div
      className="space-y-2"
      // NOTE: This inline style is to show how to set the --ring variable in your CSS file in order to change the focus ring color.
      style={{ "--ring": "234 89% 74%" } as React.CSSProperties}
    >
      <Label htmlFor="input-05">Input with colored border and ring</Label>
      <Input id="input-05" placeholder="Email" type="email" />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input05() {
  return (
    <div
      className="space-y-2"
      // NOTE: This inline style is to show how to set the --ring variable in your CSS file in order to change the focus ring color.
      style={{ "--ring": "234 89% 74%" } as React.CSSProperties}
    >
      <Label htmlFor="input-05">Input with colored border and ring</Label>
      <Input id="input-05" placeholder="Email" type="email" />
    </div>
  );
}
