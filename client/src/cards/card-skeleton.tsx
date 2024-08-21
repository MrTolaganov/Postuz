import { Card, CardContent,  } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardSkeleton() {

  return (
    <Card>
      <Skeleton className="w-full h-48" />
      <CardContent className="mt-2">
        <Skeleton className="w-2/3 h-6 my-4" />
        <Skeleton className="w-full h-4 my-2" />
        <Skeleton className="w-3/4 h-4 mt-2" />
      </CardContent>
        {/* <CardFooter className="gap-2">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </CardFooter> */}
    </Card>
  );
}
