import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { WorkflowInfoGroup } from './workflow-info-group';
import { MeasurementTriggerSrc, UploadModes } from '../../constants';

export default function SystemInfo() {

  const { t } = useTranslation();

  const { workflow, addon_features } = useSelector((state) => state.workflow);

  const [workflowInfo, setWorkflowInfo] = useState([]);

  useEffect(() => {

    const isAddonFeatureEnabled = Object.values(addon_features)?.indexOf(true) > -1;

    const addonFeature = {}

    if (isAddonFeatureEnabled) {

      addonFeature.title = 'information_page.workflow_info.addon_features.title'
      addonFeature.records = {}
      if (addon_features.bottle_mode) {
        addonFeature.records['information_page.workflow_info.addon_features.bottle_mode'] = t('information_page.workflow_info.workflow_config_values.enabled')
      }

      if (addon_features.enable_4k) {
        addonFeature.records['information_page.workflow_info.addon_features.4k_camera'] = t('information_page.workflow_info.workflow_config_values.enabled')
      }

    }

    setWorkflowInfo([
      {
        title: 'information_page.workflow_info.workflow_config.title',
        records: {
          'information_page.workflow_info.workflow_config.operating_mode':
            t(`information_page.workflow_info.workflow_config_values.${workflow.workflow_mode.operate_mode}`),
          'information_page.workflow_info.workflow_config.upload_mode':
            t(`information_page.workflow_info.workflow_config_values.${workflow.upload_mode.upload_mode}`),

          ...(
            workflow.upload_mode.upload_mode === UploadModes.SYNC
              ?
              {
                'information_page.workflow_info.workflow_config.sync_mode':
                  t(`information_page.workflow_info.workflow_config_values.${workflow.upload_mode.retry_mode}`)
              }
              :
              {
                'information_page.workflow_info.workflow_config.queue_size':
                  workflow.upload_mode.max_queue_size
              }
          )

        }
      }, {
        title: 'information_page.workflow_info.measurement_trigger.title',
        records: {
          'information_page.workflow_info.measurement_trigger.source':
            t(`information_page.workflow_info.workflow_config_values.${workflow.measurement_trigger.source}`),
          // Show measurement trigger timeout for non default mode
          ...(
            workflow.measurement_trigger.source !== MeasurementTriggerSrc.MANUAL ?
              {
                'information_page.workflow_info.measurement_trigger.timeout':
                  // For 0 seconds show no delay
                  workflow.measurement_trigger.delay_after_trigger === 0
                    ?
                    t(`information_page.workflow_info.workflow_config_values.no_delay`)
                    :
                    workflow.measurement_trigger.delay_after_trigger + 's',
              }
              :
              {}
          )
        }
      }, {
        title: 'information_page.workflow_info.additional_metrics.title',
        records: {
          'information_page.workflow_info.additional_metrics.volumetric_weight':
            workflow.volumetric_config.is_enabled ?
            `${t('information_page.workflow_info.workflow_config_values.enabled')} 
            (${workflow.volumetric_config.is_standard_divisor ? 
              t('information_page.workflow_info.workflow_config_values.static') : 
              t('information_page.workflow_info.workflow_config_values.dynamic')})`
              :
              t('information_page.workflow_info.workflow_config_values.disabled'),

          ...(
            workflow.volumetric_config.is_enabled ?
              {
                'information_page.workflow_info.additional_metrics.volumetric_round_off_method':
                  t(`information_page.workflow_info.workflow_config_values.${workflow.volumetric_config.volumetric_round_off_method}`)
              }
              :
              {}
          ),
    

          'information_page.workflow_info.additional_metrics.real_volume':
            workflow.additional_volume_data.is_real_volume_enabled ?
              t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),

          'information_page.workflow_info.additional_metrics.cubic_volume':
            workflow.additional_volume_data.is_cubic_volume_enabled ?
              t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),
        }
      }, {
        title: 'information_page.workflow_info.measurement_result.title',
        records: {
          'information_page.workflow_info.measurement_result.result_timeout':
            workflow.ui_config.result_timeout.is_enabled ?
              workflow.ui_config.result_timeout.timeout + 's' :
              t('information_page.workflow_info.workflow_config_values.disabled'),

          'information_page.workflow_info.measurement_result.measurement_reject':
            workflow.ui_config.measurement_reject.is_enabled ?
              t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),
          'information_page.workflow_info.measurement_result.additional_result':
            workflow.ui_config.additional_result.is_enabled ?
              t(`information_page.workflow_info.workflow_config_values.${workflow.ui_config.additional_result.field}`) :
              t('NA'),
        }
      }, {
        title: 'information_page.workflow_info.measurment_config.title',
        records: {
          'information_page.workflow_info.measurment_config.measurement_check':
            workflow.measurement_check?.is_enabled ?
              t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),

          'information_page.workflow_info.measurment_config.measurement_retry':
            workflow.measurement_retry_count ?
              t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),

          ...(
            workflow.measurement_retry_count &&
            {
              'information_page.workflow_info.measurment_config.measurement_retry_count':
                workflow.measurement_retry_count,
            }
          )

        }
      },
      {
        title: 'information_page.workflow_info.support_trigger.title',
        records: {
          'information_page.workflow_info.support_trigger.weighing_Scale_trigger':
            workflow.support_trigger.is_weighing_scale_trigger_enabled ?
            t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),
          
          'information_page.workflow_info.support_trigger.smart_measurement_trigger':
            workflow.support_trigger.is_measurement_trigger_enabled ?
            t('information_page.workflow_info.workflow_config_values.enabled') :
              t('information_page.workflow_info.workflow_config_values.disabled'),
        }
      },
      ...(isAddonFeatureEnabled ? [addonFeature] : [])
    ])


  }, [workflow])

  return (
    <Grid container columnSpacing={3} rowSpacing={3}  height={'78vh'} style={{ overflow: 'auto', height: '78vh' }}>
      {
        workflowInfo.map((info, index) => (
          <Grid container item xs={6} key={index}>
            <WorkflowInfoGroup title={info.title} records={info.records} />
          </Grid>
        ))
      }
    </Grid >
  )
}
