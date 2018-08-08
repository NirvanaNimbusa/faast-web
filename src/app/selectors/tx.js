import { createSelector } from 'reselect'

import { mapValues } from 'Utilities/helpers'
import { createItemSelector, selectItemId } from 'Utilities/selector'
import { ZERO } from 'Utilities/convert'

import { getAllAssets } from './asset'
import { getAllWallets } from './wallet'

export const getTxState = ({ tx }) => tx

const createTxExtender = (allAssets, allWallets) => (tx) => {
  const { walletId, outputs, receipt, assetSymbol, feeSymbol, feeAmount } = tx
  const feeAsset = allAssets[feeSymbol]
  const feeFiat = feeAsset && feeAmount ? feeAsset.price.times(feeAmount) : undefined
  const asset = allAssets[assetSymbol]
  const totalOutput = outputs.reduce((total, { amount }) => total.plus(amount), ZERO)
  const totalSent = assetSymbol === feeSymbol ? totalOutput.plus(feeAmount) : totalOutput
  return {
    ...tx,
    asset,
    signingSupported: (allWallets[walletId] || {}).isSignTxSupported,
    confirmed: receipt && receipt.confirmed,
    succeeded: receipt && receipt.succeeded,
    feeAsset: feeAsset,
    feeFiat: feeFiat,
    totalOutput,
    totalSent,
  }
}

export const getAllTxs = createSelector(
  getTxState,
  getAllAssets,
  getAllWallets,
  (txState, allAssets, allWallets) => mapValues(txState, createTxExtender(allAssets, allWallets)))
export const getAllTxsArray = createSelector(getAllTxs, Object.values)
export const getTx = createItemSelector(getAllTxs, selectItemId, (allTxs, id) => allTxs[id])
