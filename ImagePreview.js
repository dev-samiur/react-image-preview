import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


export default function ImagePreview(props) {

    const [images, setImages]= useState(undefined)
    const [imagesPreview, setImagesPreview]= useState(undefined)
    const [imgCount, setImgCount]= useState(0)
    const [maxImgNum, setMaxImgNum]= useState(4)
    const inputFileRef= useRef()

    
      const handleImageUpload= e => {
    
        if (!e.target.files || e.target.files.length === 0) 
        {
          setImages(undefined)
          return
        }
    
        if(images !== undefined)
          setImages(prev => ( [...prev,  e.target.files[0]] ) )
        else
          setImages([e.target.files[0]])
    
      }
    
      useEffect(() => {

        //save uploaded images in parent component
        props.handleImageUpload(images) 
    
        if (!images) {
          setImagesPreview(undefined)
          return
        }
    
        if( imgCount !== 0 && images.length < imgCount ){
    
          if(images.length === 0){
            setImages(undefined)
            setImagesPreview(undefined)
            inputFileRef.current.value= null
          }
          setImgCount(prev => prev-1)
          return
        }
    
        const objectUrl = URL.createObjectURL(images[imgCount])
    
        if(imagesPreview !== undefined)
          setImagesPreview(prev => [...prev, objectUrl])
        else
          setImagesPreview([objectUrl])
    
        setImgCount(prev => prev+1)
    
      }, [images])
    
      useEffect(() => {
    
        return () => (
          imagesPreview !== undefined ? ( imagesPreview.map( preview => {
            URL.revokeObjectURL(preview)
          }) ) : ''
        )
      }, [])
    
      const removePreviewImg= (index) => {
    
        const temp1 = [...imagesPreview];
        const temp2 = [...images];
    
        temp1.splice(index, 1);
        temp2.splice(index, 1);
    
        setImagesPreview(temp1)
        setImages(temp2)
      }

    return (
        <Box style={{marginTop: 50}}>

            <Box style={{ display: 'flex', flexWrap: 'wrap', rowGap: 20}}>

                { 
                imagesPreview ? 
                    imagesPreview.map( (image, index) => (
                    <Badge style={{marginRight: 20}} badgeContent={<CancelIcon style={{cursor: 'pointer'}} onClick={ () => removePreviewImg(index) } />}>
                        <Box style={{width: 80, height: 80}}><img style={{width: '100%', height: '100%', objectFit: 'cover'}} src={image}/></Box>
                    </Badge> 
                    ))
                : null
                }

                {
                imgCount < maxImgNum ? (
                    <Box style={{width: 80, height: 80, background: '#fafafa'}}>
                    <Button component="label" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                        <AddCircleOutlineIcon style={{width: 50, height: 50, cursor: 'pointer',}} color="primary"/>
                        <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                        ref={inputFileRef}
                        />
                    </Button>
                    </Box>
                ) : null
                }

            </Box>

        </Box>
    )
}
