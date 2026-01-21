import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ItemBreakdownTable = () => {
  const items = [
    { name: "Chicken Bowl", price: "$14.99", fees: "-$3.75", promo: "-$1.50", profit: "$9.74", profitable: true },
    { name: "Beef Bulgogi", price: "$16.99", fees: "-$4.25", promo: "-$0.00", profit: "$12.74", profitable: true },
    { name: "Veggie Bibimbap", price: "$12.99", fees: "-$3.25", promo: "-$2.60", profit: "$7.14", profitable: true },
    { name: "Korean Fried Chicken", price: "$11.99", fees: "-$3.00", promo: "-$6.00", profit: "$2.99", profitable: true },
    { name: "Kimchi Fries", price: "$8.99", fees: "-$2.25", promo: "-$4.50", profit: "$2.24", profitable: true },
    { name: "Bubble Tea", price: "$5.99", fees: "-$1.50", promo: "-$3.00", profit: "$1.49", profitable: true },
    { name: "Mochi Ice Cream", price: "$4.99", fees: "-$1.25", promo: "-$2.50", profit: "$1.24", profitable: true },
    { name: "Spring Rolls", price: "$6.99", fees: "-$1.75", promo: "-$5.60", profit: "-$0.36", profitable: false },
    { name: "Edamame", price: "$4.99", fees: "-$1.25", promo: "-$4.00", profit: "-$0.26", profitable: false },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Item-Level Profit Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium">Item</TableHead>
                <TableHead className="text-xs font-medium text-right">Price</TableHead>
                <TableHead className="text-xs font-medium text-right">Fees</TableHead>
                <TableHead className="text-xs font-medium text-right">Promo</TableHead>
                <TableHead className="text-xs font-medium text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow 
                  key={item.name} 
                  className={item.profitable ? '' : 'bg-red-50/50'}
                >
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell className="text-right text-sm">{item.price}</TableCell>
                  <TableCell className="text-right text-sm text-red-600">{item.fees}</TableCell>
                  <TableCell className="text-right text-sm text-red-600">{item.promo}</TableCell>
                  <TableCell className={`text-right text-sm font-semibold ${
                    item.profitable ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.profit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBreakdownTable;
