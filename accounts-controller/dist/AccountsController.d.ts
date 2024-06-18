import type { ControllerGetStateAction, ControllerStateChangeEvent, RestrictedControllerMessenger } from '@metamask/base-controller';
import { BaseController } from '@metamask/base-controller';
import type { InternalAccount } from '@metamask/keyring-api';
import type { KeyringControllerEvents, KeyringControllerGetKeyringForAccountAction, KeyringControllerGetKeyringsByTypeAction, KeyringControllerGetAccountsAction } from '@metamask/keyring-controller';
import type { SnapControllerEvents } from '@metamask/snaps-controllers';
declare const controllerName = "AccountsController";
export declare type AccountsControllerState = {
    internalAccounts: {
        accounts: Record<string, InternalAccount>;
        selectedAccount: string;
    };
};
export declare type AccountsControllerGetStateAction = ControllerGetStateAction<typeof controllerName, AccountsControllerState>;
export declare type AccountsControllerSetSelectedAccountAction = {
    type: `${typeof controllerName}:setSelectedAccount`;
    handler: AccountsController['setSelectedAccount'];
};
export declare type AccountsControllerSetAccountNameAction = {
    type: `${typeof controllerName}:setAccountName`;
    handler: AccountsController['setAccountName'];
};
export declare type AccountsControllerListAccountsAction = {
    type: `${typeof controllerName}:listAccounts`;
    handler: AccountsController['listAccounts'];
};
export declare type AccountsControllerUpdateAccountsAction = {
    type: `${typeof controllerName}:updateAccounts`;
    handler: AccountsController['updateAccounts'];
};
export declare type AccountsControllerGetSelectedAccountAction = {
    type: `${typeof controllerName}:getSelectedAccount`;
    handler: AccountsController['getSelectedAccount'];
};
export declare type AccountsControllerGetAccountByAddressAction = {
    type: `${typeof controllerName}:getAccountByAddress`;
    handler: AccountsController['getAccountByAddress'];
};
export declare type AccountsControllerGetAccountAction = {
    type: `${typeof controllerName}:getAccount`;
    handler: AccountsController['getAccount'];
};
export declare type AccountsControllerActions = AccountsControllerGetStateAction | AccountsControllerSetSelectedAccountAction | AccountsControllerListAccountsAction | AccountsControllerSetAccountNameAction | AccountsControllerUpdateAccountsAction | AccountsControllerGetAccountByAddressAction | AccountsControllerGetSelectedAccountAction | AccountsControllerGetAccountAction | KeyringControllerGetKeyringForAccountAction | KeyringControllerGetKeyringsByTypeAction | KeyringControllerGetAccountsAction;
export declare type AccountsControllerChangeEvent = ControllerStateChangeEvent<typeof controllerName, AccountsControllerState>;
export declare type AccountsControllerSelectedAccountChangeEvent = {
    type: `${typeof controllerName}:selectedAccountChange`;
    payload: [InternalAccount];
};
export declare type AccountsControllerEvents = AccountsControllerChangeEvent | AccountsControllerSelectedAccountChangeEvent | SnapControllerEvents | KeyringControllerEvents;
export declare type AccountsControllerMessenger = RestrictedControllerMessenger<typeof controllerName, AccountsControllerActions, AccountsControllerEvents, string, string>;
/**
 * Controller that manages internal accounts.
 * The accounts controller is responsible for creating and managing internal accounts.
 * It also provides convenience methods for accessing and updating the internal accounts.
 * The accounts controller also listens for keyring state changes and updates the internal accounts accordingly.
 * The accounts controller also listens for snap state changes and updates the internal accounts accordingly.
 *
 */
export declare class AccountsController extends BaseController<typeof controllerName, AccountsControllerState, AccountsControllerMessenger> {
    #private;
    /**
     * Constructor for AccountsController.
     *
     * @param options - The controller options.
     * @param options.messenger - The messenger object.
     * @param options.state - Initial state to set on this controller
     */
    constructor({ messenger, state, }: {
        messenger: AccountsControllerMessenger;
        state: AccountsControllerState;
    });
    /**
     * Returns the internal account object for the given account ID, if it exists.
     *
     * @param accountId - The ID of the account to retrieve.
     * @returns The internal account object, or undefined if the account does not exist.
     */
    getAccount(accountId: string): InternalAccount | undefined;
    /**
     * Returns an array of all internal accounts.
     *
     * @returns An array of InternalAccount objects.
     */
    listAccounts(): InternalAccount[];
    /**
     * Returns the internal account object for the given account ID.
     *
     * @param accountId - The ID of the account to retrieve.
     * @returns The internal account object.
     * @throws An error if the account ID is not found.
     */
    getAccountExpect(accountId: string): InternalAccount;
    /**
     * Returns the selected internal account.
     *
     * @returns The selected internal account.
     */
    getSelectedAccount(): InternalAccount;
    /**
     * Returns the account with the specified address.
     * ! This method will only return the first account that matches the address
     * @param address - The address of the account to retrieve.
     * @returns The account with the specified address, or undefined if not found.
     */
    getAccountByAddress(address: string): InternalAccount | undefined;
    /**
     * Sets the selected account by its ID.
     *
     * @param accountId - The ID of the account to be selected.
     */
    setSelectedAccount(accountId: string): void;
    /**
     * Sets the name of the account with the given ID.
     *
     * @param accountId - The ID of the account to set the name for.
     * @param accountName - The new name for the account.
     * @throws An error if an account with the same name already exists.
     */
    setAccountName(accountId: string, accountName: string): void;
    /**
     * Updates the internal accounts list by retrieving normal and snap accounts,
     * removing duplicates, and updating the metadata of each account.
     *
     * @returns A Promise that resolves when the accounts have been updated.
     */
    updateAccounts(): Promise<void>;
    /**
     * Loads the backup state of the accounts controller.
     *
     * @param backup - The backup state to load.
     */
    loadBackup(backup: AccountsControllerState): void;
}
export {};
//# sourceMappingURL=AccountsController.d.ts.map