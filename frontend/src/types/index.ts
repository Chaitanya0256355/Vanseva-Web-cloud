export type Role = 'ROLE_VISITOR' | 'ROLE_MEMBER' | 'ROLE_STAFF' | 'ROLE_ADMIN';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  membershipNumber?: string;
}

export interface Membership {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  membershipNumber: string;
  membershipType: 'STUDENT' | 'INDIVIDUAL' | 'PATRON' | 'LIFE_MEMBER';
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  address?: string;
  city?: string;
  postalCode?: string;
  environmentalInterests?: string;
  profileFileId?: number;
  profileFileUrl?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  targetPlants: number;
  plantedPlants: number;
  pledgedPlants: number;
  targetDonation: number;
  collectedDonation: number;
  plantUnitPrice: number;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
  coverImageFileId?: number;
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  plantProgressPercentage: number;
  fundingProgressPercentage: number;
}

export interface Donation {
  id: number;
  donationReference: string;
  userId?: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donationType: 'MONETARY' | 'PLANT_SPONSORSHIP';
  amount: number;
  plantCount?: number;
  plantSpecies?: string;
  campaignId: number;
  campaignTitle: string;
  status: 'PENDING' | 'AWAITING_VERIFICATION' | 'CONFIRMED' | 'REJECTED' | 'REFUNDED';
  paymentMethod: string;
  transactionNotes?: string;
  hasReceipt: boolean;
  receiptNumber?: string;
  receiptDownloadUrl?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  location?: string;
  campaignId?: number;
  campaignTitle?: string;
  fileId?: number;
  imageUrl: string;
  plantSpecies?: string;
  datePlanted?: string;
  isApprovedPublic: boolean;
  uploaderName: string;
  createdAt: string;
}

export interface AdminStats {
  totalMembers: number;
  activeMemberships: number;
  pendingMembershipApprovals: number;
  totalDonationPledges: number;
  confirmedDonationsTotal: number;
  pendingDonationsCount: number;
  totalPlantsSponsored: number;
  confirmedPlantsPlanted: number;
  activeCampaignsCount: number;
  totalReceiptsGenerated: number;
  approvedGalleryPhotos: number;
  nextcloudStorageConnected: boolean;
  nextcloudStatus: string;
}

export interface StorageHealth {
  healthy: boolean;
  nextcloudUrl: string;
  version: string;
  latencyMs: number;
  rootFolderStatus: string;
  message: string;
}

export interface AuditLogItem {
  id: number;
  eventType: string;
  description: string;
  userId?: number;
  userEmail?: string;
  ipAddress?: string;
  targetResource?: string;
  recordId?: number;
  createdAt: string;
}
