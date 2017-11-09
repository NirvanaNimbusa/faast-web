import React from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { reduxForm } from 'redux-form'
import HWAddressSelectController from 'Controllers/HWAddressSelectController'
import display from 'Utilities/display'
import styles from 'Styles/HardwareWallet.scss'

const HardwareWallet = (props) => {
  const name = () => {
    if (props.type === 'ledger') {
      return 'Ledger Wallet'
    }
    if (props.type === 'trezor') {
      return 'TREZOR'
    }
  }
  return (
    <div onClick={props.handleClick} className={styles.tileContainer}>
      <div className={`text-uppercase ${styles.importHeader}`}>Access With</div>
      <div className={styles.walletDesc}>
        {name()}
      </div>
      <HardwareWalletModal name={name()} type={props.type} {...props.modalProps} />
    </div>
  )
}

let HardwareWalletModal = (props) => {
  const renderHwCommStatus = (commStatus) => {
    switch (commStatus) {
      case 'connecting':
        return (
          <div className='text-center'>
            <div className='text-small text-medium-grey text-uppercase'>Status</div>
            <div className='status-icon connecting' />
            <div className='blink text-white text-uppercase text-small'>Connecting</div>
          </div>
        )
      case 'waiting':
        return (
          <div className='text-center'>
            <div className='text-small text-medium-grey text-uppercase'>Status</div>
            <div className='status-icon waiting' />
            <div className='text-white text-uppercase text-small'>Unable to connect, trying again in <span className='blink'>{props.seconds}</span> seconds</div>
          </div>
        )
      case 'connected':
        return (
          <div className='text-center'>
            <div className='text-small text-medium-grey text-uppercase'>Status</div>
            <div className='status-icon connected' />
            <div className='text-white text-uppercase text-small'>Connected</div>
            <div className='text-medium-grey'>
              {!!props.confVersion &&
                <span>&nbsp;&nbsp;(v. {props.confVersion})</span>
              }
            </div>
          </div>
        )
    }
  }

  const renderInstructions = () => {
    switch (props.type) {
      case 'trezor':
        return (
          <div className='row'>
            <div className='col-md-6 instruction-container border-right-10 border-bottom-10'>
              <div className='instruction-icon pendrive' />
              <div className='text-small'>Connect your Trezor to begin</div>
            </div>
            <div className='col-md-6 instruction-container border-bottom-10'>
              <div className='instruction-icon export' />
              <div className='text-small'>When the Trezor popop asks to export the public key, select "Export"</div>
            </div>
            <div className='col-md-12 instruction-container'>
              <div className='instruction-icon pin-code' />
              <div className='text-small'>Enter your pin if required</div>
            </div>
          </div>
        )
      case 'ledger':
        return (
          <div className='row text-center'>
            <div className='col-md-6 instruction-container border-right-10 border-bottom-10'>
              <div className='instruction-icon pendrive margin-right-10' />
              <div className='text-small'>Connect your Ledger Wallet to begin</div>
            </div>
            <div className='col-md-6 instruction-container border-bottom-10'>
              <div className='instruction-icon smartphone margin-right-10' />
              <div className='text-small'>Open the Ethereum app on the Ledger Wallet</div>
            </div>
            <div className='col-md-6 instruction-container border-right-10'>
              <div className='instruction-icon browser margin-right-10' />
              <div className='text-small'>Ensure that Browser Support is enabled in Settings</div>
            </div>
            <div className='col-md-6 instruction-container'>
              <div className='instruction-icon refresh-arrow margin-right-10' />
              <div className='text-small'>You may need to update the firmware if Browser Support is not available</div>
            </div>
          </div>
        )
    }
  }

  const renderFirstAddress = () => {
    const a = props.firstAddress
    if (a) {
      return (
        <div>
          <div className='word-break-all'>{a.address}</div>
          <div>
            {(a.hasOwnProperty('balance') &&
              <div className='margin-top-10 text-small text-white'>{display.units(a.balance, 'ETH', 1)}</div>) ||
              <div className='faast-loading loading-small margin-top-10 margin-auto' />
            }
          </div>
          <div className='form-group'>
            <div className='button-primary cursor-pointer' onClick={props.handleChooseFirstAddress}><span className='text-small'>Use this address</span></div>
          </div>
          <div className='form-group'>
            <div className='text-gradient text-center cursor-pointer' onClick={props.handleToggleAddressSelect}>Select another address</div>
          </div>
        </div>
      )
    }
  }

  return (
    <Modal className={styles.container} isOpen={props.isOpen} toggle={props.handleToggle}>
      <ModalBody>
        <div className='modal-title'>Connect to {props.name}</div>
        <div className='modal-text'>
          <div>
            {renderHwCommStatus(props.commStatus)}
          </div>
          <div className={styles.instructions}>
            {(props.commStatus !== 'connected' &&
              <div>
                {renderInstructions()}
              </div>) ||
              <div>
                {(props.showAddressSelect &&
                  <HWAddressSelectController {...props.addressSelectProps} />) ||
                  renderFirstAddress()
                }
              </div>
            }
          </div>
        </div>
        <div className='form-group'>
          <div className='cancel cursor-pointer' onClick={props.handleClose}>cancel</div>
        </div>
      </ModalBody>
    </Modal>
  )
}

HardwareWalletModal = reduxForm({
  form: 'hardwareWalletForm'
})(HardwareWalletModal)

export default HardwareWallet
