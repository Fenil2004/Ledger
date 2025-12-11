import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, CalendarDays, Filter, X } from "lucide-react";
import { format } from "date-fns";

export default function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  typeFilter, 
  setTypeFilter,
  periodFilter,
  setPeriodFilter,
  dateRange,
  setDateRange,
  parties,
  partyFilter,
  setPartyFilter,
  onClearFilters
}) {
  const hasFilters = searchTerm || typeFilter !== 'all' || partyFilter !== 'all' || periodFilter !== 'all' || dateRange.from || dateRange.to;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search party, phone, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full lg:w-40 bg-slate-50 border-slate-200">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="buying">Buying</SelectItem>
            <SelectItem value="selling">Selling</SelectItem>
          </SelectContent>
        </Select>

        {/* Party Filter */}
        <Select value={partyFilter} onValueChange={setPartyFilter}>
          <SelectTrigger className="w-full lg:w-44 bg-slate-50 border-slate-200">
            <SelectValue placeholder="Select Party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parties</SelectItem>
            {parties.map(party => (
              <SelectItem key={party.id} value={party.name}>{party.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period Filter */}
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full lg:w-40 bg-slate-50 border-slate-200">
            <CalendarDays className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range - Always visible */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full lg:w-auto justify-start bg-slate-50 border-slate-200">
              <CalendarDays className="w-4 h-4 mr-2 text-slate-400" />
              {dateRange.from ? (
                dateRange.to ? (
                  <span className="text-sm">
                    {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM')}
                  </span>
                ) : (
                  format(dateRange.from, 'dd MMM yyyy')
                )
              ) : (
                <span className="text-slate-500">Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasFilters && (
          <Button 
            variant="ghost" 
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}