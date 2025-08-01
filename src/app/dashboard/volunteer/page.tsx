'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { HelpRequest } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MapPin, Award } from 'lucide-react';
import Link from 'next/link';
import { BadgeCard } from '@/components/badge-card';
import { useAppStore } from '@/lib/request-store';


export default function VolunteerDashboard() {
  const { toast } = useToast();
  const { requests, updateRequestStatus, volunteers } = useAppStore();
  
  // In a real app, you'd get the volunteer's ID from authentication.
  // For this demo, we'll just use the first volunteer from the store.
  const volunteer = volunteers[0];

  const handleAccept = (id: string, driverName: string) => {
    updateRequestStatus(id, 'Accepted');
    toast({
      title: (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span>Request Accepted!</span>
        </div>
      ),
      description: `You are now assigned to help ${driverName}. The driver has been notified.`,
      variant: 'default',
    });
  };

  const getStatusBadge = (status: HelpRequest['status']) => {
    switch(status) {
        case 'Pending':
            return <Badge variant="destructive">{status}</Badge>;
        case 'Accepted':
            return <Badge variant="success">{status}</Badge>;
        default:
            return <Badge>{status}</Badge>
    }
  }

  // Filter for requests not yet accepted by this volunteer
  const availableRequests = requests.filter(req => req.status === 'Pending' && req.helperType !== 'garage');

  return (
    <div className="grid lg:grid-cols-3 gap-8">
     <div className="lg:col-span-2 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Availability Status</CardTitle>
            <CardDescription>Toggle the switch to start or stop receiving new requests.</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
             <Button asChild variant="outline">
                <Link href="/dashboard/volunteer/availability">Update Availability</Link>
             </Button>
            <Switch id="availability-mode" defaultChecked/>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4 font-headline">Nearby Help Requests</h2>
        <div className="space-y-4">
          {availableRequests.map((req) => (
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
                    <Button 
                      onClick={() => handleAccept(req.id, req.driverName)}
                      disabled={req.status !== 'Pending'}
                    >
                      {req.status === 'Accepted' ? 'Accepted' : 'Accept Request'}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
           {availableRequests.length === 0 && (
             <Card className="text-center p-8">
                <p className="text-muted-foreground">No active requests in your area. Check back soon!</p>
             </Card>
           )}
        </div>
      </div>
     </div>
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Your contributions to the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Your Points</span>
                </div>
                <span className="text-2xl font-bold text-primary">{volunteer.points}</span>
            </div>
            <div>
                <h3 className="font-semibold mb-4">Your Badges</h3>
                <div className="space-y-4">
                  {volunteer.badges.map(badge => (
                     <BadgeCard key={badge.id} badge={badge} />
                  ))}
                   {volunteer.badges.length === 0 && (
                    <p className="text-sm text-muted-foreground">Complete jobs to earn badges!</p>
                   )}
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
