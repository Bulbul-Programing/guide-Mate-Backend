export type TGuideSpot = {
    id: string
    guideId: string
    userId: string
    title: string
    description: string
    itinerary: string
    category: TourCategory
    durationDays: number
    maxGroupSize: number
    meetingPoint: string
    city: string
    images: string[]
    isActive: boolean
}
export type TourCategory =
    | 'FOOD'
    | 'HISTORY'
    | 'ADVENTURE'
    | 'PHOTOGRAPHY'
    | 'NIGHTLIFE'
    | 'CULTURE'