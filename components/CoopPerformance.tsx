import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CoopPerformanceCardProps {
    allCoopData: CoopData[];
}

const CoopPerformanceCard: React.FC<CoopPerformanceCardProps> = ({ allCoopData } ) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [weeklyData, setWeeklyData] = useState<DailyGroup[][]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Process data into weekly chunks by unique collection_date
  useEffect(() => {
    if (!allCoopData || !allCoopData.length) return;

    const sortedData = [...allCoopData].sort((a, b) => 
        new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime());

    // Group by collection_date
    const dateMap = new Map();
    sortedData.forEach(item => {
      const dateStr = new Date(item.collection_date).toISOString().split("T")[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, []);
      }
      dateMap.get(dateStr).push(item);
    });

    const groupedByDay = Array.from(dateMap.entries()).map(([date, entries]) => ({
      date,
      coops: entries
    }));

    const weekChunks = [];
    for (let i = 0; i < groupedByDay.length; i += 7) {
      weekChunks.push(groupedByDay.slice(i, i + 7));
    }

    setWeeklyData(weekChunks);
  }, [allCoopData]);

  // Update date range when weeklyData or currentPage changes
  useEffect(() => {
    if (weeklyData.length > 0 && weeklyData[currentPage]) {
      const chunk = weeklyData[currentPage];
      const startDate = new Date(chunk[chunk.length - 1].date);
      const endDate = new Date(chunk[0].date);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setDateRange({
          start: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          end: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
    }
  }, [currentPage, weeklyData]);

  const currentCoops = useMemo(() => {
    if (!weeklyData.length || !weeklyData[currentPage]) return [];

    const flattenedCoops: CoopEntry[] = [];
    weeklyData[currentPage].forEach(day => {
      day.coops.forEach(coop => {
        const existingIndex = flattenedCoops.findIndex(c => c.coop_name === coop.coop_name);
        if (existingIndex >= 0) {
          flattenedCoops[existingIndex].egg_count += coop.egg_count;
        } else {
          flattenedCoops.push({ ...coop });
        }
      });
    });

    return flattenedCoops.sort((a, b) => b.egg_count - a.egg_count);
  }, [weeklyData, currentPage]);

  const getProgressColor = (value: number):string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const goToPreviousWeek = () => {
    if (currentPage < weeklyData.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToNextWeek = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Coop Performance</CardTitle>
          <CardDescription>
            {dateRange.start} - {dateRange.end}
            {currentPage > 0 && " (Historical)"}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToPreviousWeek}
            disabled={currentPage >= weeklyData.length - 1}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNextWeek}
            disabled={currentPage <= 0}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentCoops.length > 0 ? (
          currentCoops.map((coop) => {
            const progress = coop.egg_count > 0 ? Math.min((coop.egg_count / 3000) * 100, 100) : 0;
            return (
              <div key={coop.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{coop.coop_name}</div>
                  <div className="text-sm font-medium">{coop.egg_count} eggs</div>
                </div>
                <Progress value={progress} className={`h-2 ${getProgressColor(progress)}`} />
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-muted-foreground">No data for this period</p>
        )}
        <div className="pt-4">
          <Link href="/dashboard/eggs">
            <Button className="w-full">View Detailed Report</Button>
          </Link>
        </div>
      </CardContent>
      {weeklyData.length > 1 && (
        <CardFooter className="justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Week {currentPage + 1} of {weeklyData.length}
          </p>
          {currentPage > 0 && (
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(0)}>
              Back to Latest
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CoopPerformanceCard;
