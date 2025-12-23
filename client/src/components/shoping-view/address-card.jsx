// import React from "react";
// import { Card, CardContent } from "../ui/card";
// import { Label } from "../ui/label";

// function AddressCard({ addressInfo }) {
//   if (!addressInfo) return null;

//   const { address, city, phone, pincode, notes } = addressInfo;

//   return (
//     <Card className="rounded-xl shadow-sm">
//       <CardContent className="space-y-1 p-4 text-sm">
//         <Label>{addressInfo?.address}</Label>
//         <Label>{addressInfo?.city}</Label>
//         <Label>{addressInfo?.pincode}</Label>
//         <Label>{addressInfo?.phone}</Label>
//         <Label>{addressInfo?.notes}</Label>

//       </CardContent>
//     </Card>
//   );
// }

// export default AddressCard;

import React from "react";
import { Card, CardContent } from "../ui/card";

function AddressCard({ addressInfo }) {
  if (!addressInfo) return null;

  const { address, city, phone, digitalAddress, notes } = addressInfo;

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="space-y-1 p-4 text-sm">
        <p className="font-medium">{address}</p>
        <p className="text-muted-foreground">
          {city} • {digitalAddress}
        </p>
        <p className="text-muted-foreground">{phone}</p>
        {notes && (
          <p className="text-xs text-muted-foreground">{notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default AddressCard;

