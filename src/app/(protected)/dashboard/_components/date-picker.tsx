"use client";

import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { parseAsIsoDate, useQueryState } from "nuqs";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [from, setFrom] = useQueryState(
        "from",
        parseAsIsoDate.withDefault(new Date()),
    );
    const [to, setTo] = useQueryState(
        "to",
        parseAsIsoDate.withDefault(addMonths(new Date(), 1)),
    );
    
    const handleDateSelect = (dateRange: DateRange | undefined) => {
        if (dateRange?.from) {
            setFrom(dateRange.from, {
                shallow: false,
            });
        }
        if (dateRange?.to) {
            setTo(dateRange.to, {
                shallow: false,
            });
        }
    };
    
    const date = {
        from,
        to,
    };

    // Check if we're on mobile
    const [isMobile, setIsMobile] = React.useState(false);
    
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base",
                            "border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            "transition-all duration-200",
                            !date && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="truncate">
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        <span className="hidden sm:inline">
                                            {format(date.from, "LLL dd, y", {
                                                locale: ptBR,
                                            })}{" "}
                                            -{" "}
                                            {format(date.to, "LLL dd, y", {
                                                locale: ptBR,
                                            })}
                                        </span>
                                        <span className="sm:hidden">
                                            {format(date.from, "dd/MM", {
                                                locale: ptBR,
                                            })}{" "}
                                            -{" "}
                                            {format(date.to, "dd/MM", {
                                                locale: ptBR,
                                            })}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">
                                            {format(date.from, "LLL dd, y", {
                                                locale: ptBR,
                                            })}
                                        </span>
                                        <span className="sm:hidden">
                                            {format(date.from, "dd/MM/yy", {
                                                locale: ptBR,
                                            })}
                                        </span>
                                    </>
                                )
                            ) : (
                                <span className="text-gray-500">
                                    <span className="hidden sm:inline">Selecionar período</span>
                                    <span className="sm:hidden">Período</span>
                                </span>
                            )}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className={cn(
                        "w-auto p-0 shadow-lg border-0",
                        isMobile && "w-screen max-w-sm mx-4"
                    )} 
                    align={isMobile ? "center" : "start"}
                    side={isMobile ? "bottom" : "bottom"}
                    sideOffset={8}
                >
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={isMobile ? 1 : 2}
                        locale={ptBR}
                        className={cn(
                            "rounded-lg",
                            isMobile && "w-full"
                        )}
                        classNames={{
                            months: cn(
                                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                isMobile && "space-y-4"
                            ),
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                                "h-8 w-8 sm:h-9 sm:w-9 border border-gray-200 hover:bg-gray-100",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: cn(
                                "text-gray-500 rounded-md w-8 sm:w-9 font-normal text-xs sm:text-sm",
                                "flex items-center justify-center"
                            ),
                            row: "flex w-full mt-2",
                            cell: cn(
                                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                "h-8 w-8 sm:h-9 sm:w-9"
                            ),
                            day: cn(
                                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                                "h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                "transition-colors duration-200"
                            ),
                            day_range_start: "day-range-start bg-blue-600 text-white hover:bg-blue-700",
                            day_range_end: "day-range-end bg-blue-600 text-white hover:bg-blue-700",
                            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
                            day_today: "bg-gray-100 text-gray-900 font-semibold",
                            day_outside: "text-gray-400 opacity-50",
                            day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                            day_range_middle: "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                            day_hidden: "invisible",
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

