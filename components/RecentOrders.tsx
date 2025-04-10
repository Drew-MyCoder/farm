import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStatusStyle } from '@/lib/statusUtils';

interface RecentOrdersCardProps {
    orders: Order[];
}

const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({ orders }) => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [timeFilter, setTimeFilter] = useState("7days"); // default to last 7 days
  
  useEffect(() => {
    // Function to filter orders based on selected time period
    const filterOrdersByTime = () => {
      const now = new Date();
      let cutoffDate = new Date();
      
      // Set cutoff date based on selected filter
      switch (timeFilter) {
        case "7days":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case "all":
          cutoffDate = new Date(0); // Beginning of time
          break;
        default:
          cutoffDate.setDate(now.getDate() - 7);
      }
      
      // Filter orders more recent than the cutoff date
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.date_of_delivery);
        return orderDate >= cutoffDate;
      });
      
      // Sort by date (most recent first)
      filtered.sort((a: Order, b: Order) => new Date(b.date_of_delivery).getTime() - new Date(a.date_of_delivery).getTime());
      
      setFilteredOrders(filtered);
    };
    
    filterOrdersByTime();
  }, [orders, timeFilter]);
  
  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={timeFilter === "7days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("7days")}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={timeFilter === "30days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("30days")}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={timeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeFilter("all")}
          >
            All Orders
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No orders in the selected period</p>
          ) : (
            filteredOrders.map((order, index) => {
              const { bg, icon, text } = getStatusStyle(order.status_of_delivery);
              return (
                <div key={order.id} className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}>{icon}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{index + 1} - {order.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.crates_desired} crates - ₵{order.amount} - Due {new Date(order.date_of_delivery).toDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className={text}>
                    {order.status_of_delivery}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersCard;