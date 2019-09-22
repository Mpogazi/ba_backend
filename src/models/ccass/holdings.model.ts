export class CcassHoldingsModel {
    id: number;
    code: number;
    date: Date;
    participantId: string;
    participantName: string;
    participantAddress: string;
    holding: string;
    holdingPercentage: number;
    isCIP: boolean;
    scrapeDate: Date;
}