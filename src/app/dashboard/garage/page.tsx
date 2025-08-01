'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { HelpRequest } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MapPin, Wrench } from 'lucide-react';
import { useAppStore } from '@/lib/request-store';

export default function GarageDashboard() {
  const { toast } = useToast();
  // Get requests and actions from the Zustand store
  const { requests, updateRequestStatus } = useAppStore();

  // Filter requests to only show those relevant to the garage
  const garageRequests = requests.filter(req => req.helperType === 'garage');

  const handleAccept = (id: string, driverName: string) => {
    // Update the status in the central store
    updateRequestStatus(id, 'Accepted');
    toast({
      title: (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span>Job Accepted!</span>
        </div>
      ),
      description: `You are assigned to assist ${driverName}. The driver has been notified to confirm.`,
    });
  };

  const handleComplete = (id: string) => {
    // Update the status in the central store
    updateRequestStatus(id, 'Completed');
    toast({
      title: (
        <div className="flex items-center">
          <Wrench className="h-5 w-5 text-primary mr-2" />
          <span>Job Completed!</span>
        </div>
      ),
      description: `Request #${id.slice(-3)} has been marked as completed.`,
    });
  };
  
  const getStatusBadge = (status: HelpRequest['status']) => {
    switch(status) {
        case 'Pending':
            return <Badge variant="destructive">{status}</Badge>;
        case 'Accepted':
            return <Badge variant="default">Accepted</Badge>;
        case 'Confirmed':
            return <Badge variant="secondary">Confirmed by Driver</Badge>;
        case 'Completed':
            return <Badge variant="success">{status}</Badge>;
        default:
            return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Shop Status</CardTitle>
            <CardDescription>Toggle to appear available for new job requests.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="availability-mode" defaultChecked />
            <label htmlFor="availability-mode" className="font-medium">Open for Business</label>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">Nearby Job Requests</h2>
        <div className="space-y-4">
          {garageRequests.map((req) => (
            <Card key={req.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle>{req.issue}</CardTitle>
                    <CardDescription>{req.driverName} - {req.vehicle}</CardDescription>
                  </div>
                   {getStatusBadge(req.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  <span>{req.location} ({req.distance} miles away)</span>
                </div>
                <Separator className="my-4"/>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{req.timestamp}</p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => handleComplete(req.id)}
                            disabled={req.status === 'Completed' || req.status === 'Pending'}
                        >
                            Mark Completed
                        </Button>
                        <Button 
                            onClick={() => handleAccept(req.id, req.driverName)}
                            disabled={req.status !== 'Pending'}
                        >
                           {req.status === 'Pending' ? 'Accept Job' : 'Accepted'}
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
           {garageRequests.length === 0 && (
             <Card className="text-center p-8">
                <p className="text-muted-foreground">No active requests in your area. Check back soon!</p>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
}
