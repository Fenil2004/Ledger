import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Calculator, Package } from "lucide-react";

const BS_ITEMS = [
  "Shoes HNY", "Shoes Black", "Sheet HNY", "Sheet Black", 
  "Mixed Lot", "Premium Grade", "Standard Grade", "Reject"
];

export default function SellingForm({ transaction, parties, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    transaction_type: 'selling',
    date: new Date().toISOString().split('T')[0],
    phone: '',
    party_name: '',
    item_name: '',
    hny_rate: '',
    hny_weight: '',
    black_rate: '',
    black_weight: '',
    shoes_hny: '',
    sheet_hny: '',
    shoes_black: '',
    sheet_black: '',
    total_weight: '',
    total_payment: '',
    notes: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...formData,
        ...transaction,
        date: transaction.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  // Auto-calculate totals
  useEffect(() => {
    const hnyWeight = parseFloat(formData.hny_weight) || 0;
    const blackWeight = parseFloat(formData.black_weight) || 0;
    const hnyRate = parseFloat(formData.hny_rate) || 0;
    const blackRate = parseFloat(formData.black_rate) || 0;

    const totalWeight = hnyWeight + blackWeight;
    const totalPayment = (hnyWeight * hnyRate) + (blackWeight * blackRate);

    setFormData(prev => ({
      ...prev,
      total_weight: totalWeight,
      total_payment: totalPayment
    }));
  }, [formData.hny_weight, formData.black_weight, formData.hny_rate, formData.black_rate]);

  const handlePartySelect = (partyName) => {
    const party = parties.find(p => p.name === partyName);
    setFormData(prev => ({
      ...prev,
      party_name: partyName,
      phone: party?.phone || prev.phone
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      hny_rate: parseFloat(formData.hny_rate) || 0,
      hny_weight: parseFloat(formData.hny_weight) || 0,
      black_rate: parseFloat(formData.black_rate) || 0,
      black_weight: parseFloat(formData.black_weight) || 0,
      shoes_hny: parseFloat(formData.shoes_hny) || 0,
      sheet_hny: parseFloat(formData.sheet_hny) || 0,
      shoes_black: parseFloat(formData.shoes_black) || 0,
      sheet_black: parseFloat(formData.sheet_black) || 0,
      total_weight: parseFloat(formData.total_weight) || 0,
      total_payment: parseFloat(formData.total_payment) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-800">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-600">Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-slate-600">Party Name</Label>
              <Select value={formData.party_name} onValueChange={handlePartySelect}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select party" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map(party => (
                    <SelectItem key={party.id} value={party.name}>{party.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or enter new party name"
                value={formData.party_name}
                onChange={(e) => setFormData({ ...formData, party_name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-slate-600">Phone</Label>
              <Input
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-600">Item Name</Label>
              <Select value={formData.item_name} onValueChange={(v) => setFormData({ ...formData, item_name: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {BS_ITEMS.map(item => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Item Counts */}
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-purple-700 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Item Counts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-amber-600">Shoes HNY</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.shoes_hny}
                  onChange={(e) => setFormData({ ...formData, shoes_hny: e.target.value })}
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label className="text-amber-600">Sheet HNY</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.sheet_hny}
                  onChange={(e) => setFormData({ ...formData, sheet_hny: e.target.value })}
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label className="text-slate-600">Shoes Black</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.shoes_black}
                  onChange={(e) => setFormData({ ...formData, shoes_black: e.target.value })}
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label className="text-slate-600">Sheet Black</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.sheet_black}
                  onChange={(e) => setFormData({ ...formData, sheet_black: e.target.value })}
                  className="mt-1 bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HNY Color */}
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-amber-700">HNY (Color)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-amber-600">Rate (₹/kg)</Label>
              <Input
                type="number"
                placeholder="Enter rate"
                value={formData.hny_rate}
                onChange={(e) => setFormData({ ...formData, hny_rate: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-amber-600">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight"
                value={formData.hny_weight}
                onChange={(e) => setFormData({ ...formData, hny_weight: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div className="pt-2 border-t border-amber-200">
              <p className="text-sm text-amber-600">Subtotal</p>
              <p className="text-xl font-bold text-amber-700">
                ₹{((parseFloat(formData.hny_rate) || 0) * (parseFloat(formData.hny_weight) || 0)).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Black Color */}
        <Card className="border-slate-300 bg-slate-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-700">Black (Color)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-600">Rate (₹/kg)</Label>
              <Input
                type="number"
                placeholder="Enter rate"
                value={formData.black_rate}
                onChange={(e) => setFormData({ ...formData, black_rate: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div>
              <Label className="text-slate-600">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Enter weight"
                value={formData.black_weight}
                onChange={(e) => setFormData({ ...formData, black_weight: e.target.value })}
                className="mt-1 bg-white"
              />
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-sm text-slate-600">Subtotal</p>
              <p className="text-xl font-bold text-slate-700">
                ₹{((parseFloat(formData.black_rate) || 0) * (parseFloat(formData.black_weight) || 0)).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Totals */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calculated Totals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-green-100">
              <p className="text-sm text-green-600">Total Weight</p>
              <p className="text-2xl font-bold text-green-700">{formData.total_weight} kg</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-100">
              <p className="text-sm text-green-600">Total Payment</p>
              <p className="text-2xl font-bold text-green-700">₹{formData.total_payment.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-100">
              <Label className="text-slate-600 text-sm">Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 bg-white min-h-[60px]"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          {transaction ? 'Update' : 'Save'} Transaction
        </Button>
      </div>
    </form>
  );
}