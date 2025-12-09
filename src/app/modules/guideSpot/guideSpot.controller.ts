import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { guideService } from "./guideSpot.service";

const createGuide = catchAsync(async (req: Request, res: Response) => {
    const guideInfo = req.body
    guideInfo.guideId = req.user.userId;
    const result = await guideService.creteGuideSpot(guideInfo);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide spot created successfully!",
        data: result
    });
});

const updateGuide = catchAsync(async (req: Request, res: Response) => {
    const guideSpotId = req.params.guideSpotId;
    const guideSpotData = req.body;
    const result = await guideService.updateGuideSpot(guideSpotId, guideSpotData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide spot updated successfully!",
        data: result
    });
})

const getAllGuideSpots = catchAsync(async (req: Request, res: Response) => {
    const result = await guideService.getAllGuideSpots(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide spots retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
})

const getGuideSpotsDetails = catchAsync(async (req: Request, res: Response) => {
    const guideId = req.params.guideId
    const result = await guideService.getGuideDetails(guideId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide spots details retrieved successfully!",
        data: result
    });
})

const deleteGuideSpot = catchAsync(async (req: Request, res: Response) => {
    const guideSpotId = req.params.guideSpotId;
    await guideService.deleteGuideSpot(guideSpotId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Guide spot deleted successfully!",
        data: null
    })
})

export const guideController = {
    createGuide,
    getAllGuideSpots,
    getGuideSpotsDetails,
    updateGuide,
    deleteGuideSpot
}