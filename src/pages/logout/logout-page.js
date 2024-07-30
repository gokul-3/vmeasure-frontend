import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userAuth from '../../redux/reducers/user-auth'
import workflow from '../../redux/reducers/workflow'
import { useTranslation } from 'react-i18next';
import ConfirmationDialog from "../../components/dialogs/confirmation-dialog";

export default function LogoutPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleClose = (status) => {
    if (status) {
      dispatch(userAuth.extraActions.userLogout())
      dispatch(workflow.actions.clearWorkflow())
    } else {
      navigate(-1)
    }
  }

  const { t } = useTranslation()

  return (
    <ConfirmationDialog
      title={t('logout_page.title')}
      content={t('logout_page.content')}
      onClose={handleClose}
      open={true}
      buttonValue={t('common.button.yes')}
      cancelBtnValue={t('common.button.no')}
      isCancellable={true}
    />
  );
}
