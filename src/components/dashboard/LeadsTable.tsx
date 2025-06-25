import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Users,
  UserCheck,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Lead {
  id: string;
  name: string;
  email: string;
  date: string;
  status: "new" | "contacted" | "qualified" | "unqualified";
  isOpened: boolean;
  campaignId: string;
  campaignName: string;
  location?: string;
  phone?: string;
  region?: string;
  message?: string;
}

interface LeadsTableProps {
  campaignId?: string;
  campaignName?: string;
}

const LeadsTable = ({
  campaignId = "all",
  campaignName = "All Campaigns",
}: LeadsTableProps) => {
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  // Mock data for demonstration
  const mockLeads: Lead[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      date: "2023-06-15",
      status: "new",
      isOpened: false,
      campaignId: "campaign-1",
      campaignName: "Summer Sale 2023",
      location: "New York, USA",
      phone: "+1 (555) 123-4567",
      region: "North America",
      message:
        "I'm interested in learning more about your enterprise solutions.",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@company.co",
      date: "2023-06-14",
      status: "contacted",
      isOpened: true,
      campaignId: "campaign-2",
      campaignName: "Product Launch",
      location: "London, UK",
      phone: "+44 20 1234 5678",
      region: "Europe",
      message:
        "Please send me pricing information for your small business package.",
    },
    {
      id: "3",
      name: "Miguel Rodriguez",
      email: "miguel@startup.io",
      date: "2023-06-13",
      status: "qualified",
      isOpened: true,
      campaignId: "campaign-1",
      campaignName: "Summer Sale 2023",
      location: "Barcelona, Spain",
      phone: "+34 612 345 678",
      region: "Europe",
      message:
        "We're looking to implement your solution across our organization of 50+ employees.",
    },
    {
      id: "4",
      name: "Aisha Patel",
      email: "a.patel@tech.com",
      date: "2023-06-12",
      status: "unqualified",
      isOpened: false,
      campaignId: "campaign-3",
      campaignName: "Holiday Special",
      location: "Mumbai, India",
      phone: "+91 98765 43210",
      region: "Asia",
      message:
        "Just researching options at this point. No immediate plans to purchase.",
    },
    {
      id: "5",
      name: "David Chen",
      email: "david.chen@global.org",
      date: "2023-06-11",
      status: "new",
      isOpened: true,
      campaignId: "campaign-2",
      campaignName: "Product Launch",
      location: "Singapore",
      phone: "+65 8765 4321",
      region: "Asia",
      message:
        "Looking for a solution that can handle international compliance requirements.",
    },
    {
      id: "6",
      name: "Emma Wilson",
      email: "emma.w@tech.startup",
      date: "2023-06-10",
      status: "new",
      isOpened: false,
      campaignId: "campaign-3",
      campaignName: "Holiday Special",
      location: "Toronto, Canada",
      phone: "+1 (416) 555-0123",
      region: "North America",
      message: "Interested in your services for our growing team.",
    },
  ];

  // Mock campaigns for demonstration
  const mockCampaigns = [
    { id: "campaign-1", name: "Summer Sale 2023" },
    { id: "campaign-2", name: "Product Launch" },
    { id: "campaign-3", name: "Holiday Special" },
  ];

  const toggleExpandLead = (leadId: string) => {
    if (expandedLeadId === leadId) {
      setExpandedLeadId(null);
    } else {
      setExpandedLeadId(leadId);
    }
  };

  const handleStatusChange = (
    leadId: string,
    newStatus: "new" | "contacted" | "qualified" | "unqualified",
  ) => {
    // In a real application, this would update the status in your database
    console.log(`Updating lead ${leadId} status to ${newStatus}`);
  };

  const toggleLeadOpened = (leadId: string) => {
    // In a real application, this would update the opened status in your database
    console.log(`Toggling lead ${leadId} opened status`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "contacted":
        return "secondary";
      case "qualified":
        return "success";
      case "unqualified":
        return "destructive";
      default:
        return "default";
    }
  };

  // Filter leads based on search term, status filter, and campaign
  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      searchTerm === "" ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;

    const matchesCampaign =
      selectedCampaign === "all" || lead.campaignId === selectedCampaign;

    return matchesSearch && matchesStatus && matchesCampaign;
  });

  // Calculate metrics
  const totalLeads = filteredLeads.length;
  const newLeads = filteredLeads.filter((lead) => lead.status === "new").length;
  const openedLeads = filteredLeads.filter((lead) => lead.isOpened).length;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Leads</p>
                <p className="text-2xl font-bold text-gray-900">{newLeads}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Opened Leads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {openedLeads}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedCampaign === "all"
              ? "All Campaigns"
              : mockCampaigns.find((c) => c.id === selectedCampaign)?.name ||
                "Campaign"}{" "}
            Leads
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredLeads.length} leads found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {mockCampaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <TableRow className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpandLead(lead.id)}
                        aria-label={
                          expandedLeadId === lead.id
                            ? "Collapse details"
                            : "Expand details"
                        }
                      >
                        {expandedLeadId === lead.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      onClick={() => toggleExpandLead(lead.id)}
                    >
                      {lead.name}
                    </TableCell>
                    <TableCell onClick={() => toggleExpandLead(lead.id)}>
                      {lead.email}
                    </TableCell>
                    <TableCell onClick={() => toggleExpandLead(lead.id)}>
                      <span className="text-sm text-gray-600">
                        {lead.campaignName}
                      </span>
                    </TableCell>
                    <TableCell onClick={() => toggleExpandLead(lead.id)}>
                      {new Date(lead.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={() => toggleExpandLead(lead.id)}>
                      <Badge
                        variant={getStatusBadgeVariant(lead.status) as any}
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLeadOpened(lead.id)}
                        className="flex items-center gap-1"
                      >
                        {lead.isOpened ? (
                          <>
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">
                              Opened
                            </span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Not Opened
                            </span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        defaultValue={lead.status}
                        onValueChange={(value) =>
                          handleStatusChange(lead.id, value as any)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="unqualified">
                            Unqualified
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>

                  {expandedLeadId === lead.id && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50 p-0">
                        <Card className="border-0 shadow-none">
                          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Location
                              </h4>
                              <p className="text-sm">
                                {lead.location || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Phone Number
                              </h4>
                              <p className="text-sm">
                                {lead.phone || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Region
                              </h4>
                              <p className="text-sm">
                                {lead.region || "Not provided"}
                              </p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">
                                Message
                              </h4>
                              <p className="text-sm">
                                {lead.message || "No message provided"}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No leads found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsTable;
