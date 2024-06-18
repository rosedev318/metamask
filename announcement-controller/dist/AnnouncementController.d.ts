import type { ControllerGetStateAction, ControllerStateChangeEvent, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
declare type ViewedAnnouncement = {
    [id: number]: boolean;
};
declare type Announcement = {
    id: number;
    date: string;
};
/**
 * A map of announcement ids to Announcement objects
 */
export declare type AnnouncementMap = {
    [id: number]: Announcement;
};
declare type StateAnnouncement = Announcement & {
    isShown: boolean;
};
/**
 * A map of announcement ids to StateAnnouncement objects
 */
export declare type StateAnnouncementMap = {
    [id: number]: StateAnnouncement;
};
/**
 * Announcement state will hold all the seen and unseen announcements
 * that are still active
 */
export declare type AnnouncementControllerState = {
    announcements: StateAnnouncementMap;
};
export declare type AnnouncementControllerActions = AnnouncementControllerGetStateAction;
export declare type AnnouncementControllerEvents = AnnouncementControllerStateChangeEvent;
export declare type AnnouncementControllerGetStateAction = ControllerGetStateAction<typeof controllerName, AnnouncementControllerState>;
export declare type AnnouncementControllerStateChangeEvent = ControllerStateChangeEvent<typeof controllerName, AnnouncementControllerState>;
declare const controllerName = "AnnouncementController";
export declare type AnnouncementControllerMessenger = RestrictedControllerMessenger<typeof controllerName, AnnouncementControllerActions, AnnouncementControllerEvents, never, never>;
/**
 * Controller for managing in-app announcements.
 */
export declare class AnnouncementController extends BaseController<typeof controllerName, AnnouncementControllerState, AnnouncementControllerMessenger> {
    #private;
    /**
     * Creates a AnnouncementController instance.
     *
     * @param args - The arguments to this function.
     * @param args.messenger - Messenger used to communicate with BaseV2 controller.
     * @param args.state - Initial state to set on this controller.
     * @param args.allAnnouncements - Announcements to be passed through to #addAnnouncements
     */
    constructor({ messenger, state, allAnnouncements, }: {
        messenger: AnnouncementControllerMessenger;
        state?: AnnouncementControllerState;
        allAnnouncements: AnnouncementMap;
    });
    /**
     * Updates the status of the status of the specified announcements
     * once it is read by the user.
     *
     * @param viewedIds - The announcement IDs to mark as viewed.
     */
    updateViewed(viewedIds: ViewedAnnouncement): void;
}
export {};
//# sourceMappingURL=AnnouncementController.d.ts.map