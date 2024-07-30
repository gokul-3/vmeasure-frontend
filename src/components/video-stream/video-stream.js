import React, { useEffect, useRef, useState } from "react";
import * as streamService from '../../services/stream.service'
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";

export default function VideoStream({ defaultSrc, isStreamEnabled, isShowExternalImage, externalImage, isWorkareaRect, isShowAnglePoints = false, is4KEnabled = false, videoStreamBackgroundColour = "#E8E8E8" }) {

  const imageRef = useRef();
  const { t } = useTranslation();

  // We are using dataRef to update the streaming with affecting the interval timer
  const dataRef = useRef({
    isStreamEnabled: true,
    isShowExternalImage: false,
    externalImage: '',
    isCalibrationCompleted: false
  });

  const { is_calibration_completed } = useSelector((state) => state.appState);
  const { font_size: fontSize } = useSelector(state => state.applicationState);

  const location = useLocation();

  useEffect(() => {
    dataRef.isStreamEnabled = isStreamEnabled;
  }, [isStreamEnabled]);

  useEffect(() => {
    dataRef.isShowExternalImage = isShowExternalImage;
  }, [isShowExternalImage]);

  useEffect(() => {
    dataRef.externalImage = externalImage;
  }, [externalImage]);

  useEffect(() => {
    dataRef.current.isCalibrationCompleted = is_calibration_completed
  }, [is_calibration_completed]);

  useEffect(() => {

    const videoWidth = isWorkareaRect ? 480 : 400;
    const videoHeight = isWorkareaRect ? 780 : 530;

    const fps = 8;
    const intervalTimer = 1000 / fps;

    const imgRefWidth = videoWidth / videoHeight * imageRef.current.offsetHeight;
    imageRef.current.style.width = imgRefWidth + 'px';

    let imgHeight = imageRef.current.offsetHeight;
    let imgTop = 0;
    let imgBottom = 0;
    let imgleft = 0;
    let imgWidth = imgRefWidth;
    console.error('fontSize : ', fontSize);
    const getImgTopDivisor = () => {
      return (fontSize?.toUpperCase() === "DEFAULT") || isShowAnglePoints ? 60 : 25
    }
    const getImgLeftDivisor = () => {
      return (fontSize?.toUpperCase() === "DEFAULT") || isShowAnglePoints ? 40 : 5
    }
    const getImgBottomDivisor = () => {
      return (fontSize?.toUpperCase() === "DEFAULT") || isShowAnglePoints ? 190 : 155
    }
    if (isWorkareaRect) {

      imgTop = (getImgTopDivisor() / videoHeight) * imageRef.current.offsetHeight;
      imgleft = (getImgLeftDivisor() / videoWidth) * imgWidth;
      imgBottom = (getImgBottomDivisor() / videoHeight) * imageRef.current.offsetHeight;

      imgHeight = imageRef.current.offsetHeight - imgTop - imgBottom;
      imgWidth = imgWidth - (2 * imgleft);

    }

    const textHTML = `
      <div style="margin-left:40px; margin-top: 53px;">
        <div style="font-size:26px;color:rgb(52, 133, 247);height:50px">
          <span class="calibration-circle" style="background-color:rgb(52, 133, 247)"></span>
            ${t('calibration_page.stream_message.blue_circle_notes')}
        </div>
        <div style="font-size:26px;color:black;height:50px">
          <span class="calibration-circle" style="background-color:black"></span>
            ${t('calibration_page.stream_message.black_circle_notes')}
        </div>
      </div>
    `

    const interval = setInterval(async () => {
      if (!imageRef.current) {
        return
      }
      if (dataRef.isStreamEnabled) {
        try {
          let result = await streamService.getFrame(isWorkareaRect, isShowAnglePoints, is4KEnabled);
          if (result.status && result.data.frame.length) {
            // Used innerHTML to avoid memory overload in React
            imageRef.current.innerHTML = `
              <img src='data:image/jpeg;base64,${result.data.frame}' style="margin-top:${imgTop}px;margin-left:${imgleft}px;height:${imgHeight}px;width:${imgWidth}px" }}>
              ${isShowAnglePoints ? textHTML : ''}
            `
          }
        } catch (err) {
        }
      } else if (dataRef.isShowExternalImage) {

        imageRef.current.innerHTML = `<img src='data:image/jpeg;base64,${dataRef.externalImage}' height=${imageRef.current?.offsetHeight} style="margin:'auto'">`
      }
    }, intervalTimer);
    // Clear the interval after the component is dismounted
    return () => {
      console.log('clear interval :', interval)
      clearInterval(interval);
    };
  }, [is4KEnabled, fontSize]);


  return (
    <div ref={imageRef} style={{ height: '100%', backgroundColor: videoStreamBackgroundColour }}>
      <img src={defaultSrc} alt="no idex" height={'100%'} style={{ margin: 'auto' }}></img>
    </div>
  )
}
