/* Taken from https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743
    all credit to user rmorse */

/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Source: https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874#diff-b60f1a2d4276b2a605c05e19816634111de2e8a4186fe9dd7de8e344b65ed4d3L344-L381
 */
 import { useContext, useEffect, useCallback } from 'react';
 import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

 export function useBlocker( blocker, when = true ) {
     const { navigator } = useContext( NavigationContext );

     useEffect( () => {
         if ( ! when ) return;

         const unblock = navigator.block( ( tx ) => {
             const autoUnblockingTx = {
                 ...tx,
                 retry() {
                     // Automatically unblock the transition so it can play all the way
                     // through before retrying it.
                     unblock();
                     tx.retry();
                 },
             };

             blocker( autoUnblockingTx );
         } );

         return unblock;
     }, [ navigator, blocker, when ] );
 }

 export function usePrompt( message, when = true ) {
     const blocker = useCallback(
         ( tx ) => {
             // eslint-disable-next-line no-alert
             if ( window.confirm( message ) ) tx.retry();
         },
         [ message ]
     );

     useBlocker( blocker, when );
 }
