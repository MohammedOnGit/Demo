import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AddressCard({ addressInfo, setFormData, handleDeleteAddress }) {
  return (
    <Card className="relative">
      <CardContent className="space-y-2">
        <p className="font-medium">{addressInfo.address}</p>
        <p className="text-sm text-muted-foreground">{addressInfo.city}</p>
        <p className="text-sm">{addressInfo.phone}</p>
        <p className="text-sm">{addressInfo.digitalAddress}</p>
        {addressInfo.notes && (
          <p className="text-sm italic">{addressInfo.notes}</p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormData({ ...addressInfo })}
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteAddress(addressInfo._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
