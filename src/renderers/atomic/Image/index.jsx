import './style.scss'
import React from 'react'
import Switch from 'components/common/Switch'

export default class Image extends React.Component {

  state = {
    toolbarVisible: false,
    toolbarOffset: 0,
    linkEditorVisible: false,
    sizeEditorVisible: false,
    tempLink: null,
    tempWidth: null,
    tempHeight: null,
    showRemove: false
  }

  showRemoveBtn = () => {
    if (!this.state.showRemove) {
      this.setState({
        showRemove: true
      }, () => {
        this.props.editor.setEditorProp('readOnly', true)
      })
    }
  }
  hideRemoveBtn = () => {
    this.setState({
      showRemove: false
    }, () => {
      this.props.editor.setEditorProp('readOnly', false)
    })
  }

  render () {

    const { mediaData, language, imageControls } = this.props
    const { toolbarVisible, toolbarOffset, linkEditorVisible, sizeEditorVisible } = this.state
    const blockData = this.props.block.getData()

    let float = blockData.get('float')
    let alignment = blockData.get('alignment')
    let { url, link, link_target, width, height } = mediaData
    let imageStyles = {}
    let clearFix = false

    if (float) {
      alignment = null
    } else if (alignment === 'left') {
      imageStyles.float = 'left'
      clearFix = true
    } else if (alignment === 'right') {
      imageStyles.float = 'right'
      clearFix = true
    } else if (alignment === 'center') {
      imageStyles.textAlign = "center"
    } else {
      imageStyles.float = 'left'
      clearFix = true
    }

    let imgDisable = false;
    if (url) {
      if (url.indexOf("img.alicdn.com") < 0) { // 不是阿里域名下的图片
          imgDisable = true;
      }
    }

    return (
      <div className="braft-editor-custom-block" onMouseEnter={this.showRemoveBtn} onMouseLeave={this.hideRemoveBtn}>
        <img src={url} width={width} style={{width: '220px', height: 'auto', border: '1px solid #ccc'}}/>
        <span className="braft-editor-block-remove" style={{display: this.state.showRemove ? 'block' : 'none' }}>
          <a href="javascript:;" onClick={this.removeImage}>×</a>
        </span>
        <span style={{
            border: "1px solid rgb(0, 0, 0)",
            position: "absolute",
            top: "0px",
            width: "220px",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "rgb(255, 255, 255)",
            display: "block",
            height: "100%",
            paddingTop: "42%",
            display: imgDisable ? "block" : "none"
        }}>该图片无效, 请重新上传</span>
      </div>
      // <div className="braft-media-embeder">
      //   <div
      //     style={imageStyles}
      //     className="braft-embed-image"
      //     onMouseOver={this.showToolbar}
      //     onMouseLeave={this.hideToolbar}
      //   >
      //     {toolbarVisible && (
      //     <div
      //       style={{marginLeft: toolbarOffset}}
      //       ref={instance => this.toolbarElement = instance}
      //       data-float={float}
      //       data-alignment={alignment}
      //       className="braft-embed-image-toolbar"
      //     >
      //       {linkEditorVisible ? (
      //         <div onClick={this.preventDefault} className="braft-embed-image-link-editor">
      //           <div className="editor-input-group">
      //             <input type="text" placeholder={language.linkEditor.inputWithEnterPlaceHolder} onKeyDown={this.handleLinkInputKeyDown} onChange={this.setImageLink} defaultValue={link}/>
      //             <button type="button" onClick={this.confirmImageLink}>{language.base.confirm}</button>
      //           </div>
      //           <div className="switch-group">
      //             <Switch
      //               active={link_target === '_blank'}
      //               onClick={() => this.setImageLinkTarget(link_target)}
      //             />
      //             <label>{language.linkEditor.openInNewWindow}</label>
      //           </div>
      //         </div>
      //       ) : null}
      //       {sizeEditorVisible ? (
      //         <div onClick={this.preventDefault} className="braft-embed-image-size-editor">
      //           <div className="editor-input-group">
      //             <input type="text" placeholder={language.base.width} onKeyDown={this.handleSizeInputKeyDown} onChange={this.setImageWidth} defaultValue={width}/>
      //             <input type="text" placeholder={language.base.height} onKeyDown={this.handleSizeInputKeyDown} onChange={this.setImageHeight} defaultValue={height}/>
      //             <button type="button" onClick={this.confirmImageSize}>{language.base.confirm}</button>
      //           </div>
      //         </div>
      //       ) : null}
      //       {imageControls.floatLeft ? <a data-float="left" onClick={this.setImageFloat}>&#xe91e;</a> : null}
      //       {imageControls.floatRight ? <a data-float="right" onClick={this.setImageFloat}>&#xe914;</a> : null}
      //       {imageControls.alignLeft ? <a data-alignment="left" onClick={this.setImageAlignment}>&#xe027;</a> : null}
      //       {imageControls.alignCenter ? <a data-alignment="center" onClick={this.setImageAlignment}>&#xe028;</a> : null}
      //       {imageControls.alignRight ? <a data-alignment="right" onClick={this.setImageAlignment}>&#xe029;</a> : null}
      //       {imageControls.size ? <a onClick={this.toggleSizeEditor}>&#xe3c2;</a> : null}
      //       {imageControls.link ? <a className={link ? 'active' : ''} onClick={this.toggleLinkEditor}>&#xe91a;</a> : null}
      //       {imageControls.remove ? <a onClick={this.removeImage}>&#xe9ac;</a> : null}
      //       <i style={{marginLeft: toolbarOffset * -1}} className="braft-embed-image-toolbar-arrow"></i>
      //     </div>
      //     )}
      //     <img
      //       ref={instance => this.imageElement = instance}
      //       src={url} style={{width, height}} width={width} height={height}
      //     />
      //   </div>
      //   {clearFix && <div className="clearfix" style={{clear:'both',height:0,lineHeight:0,float:'none'}}></div>}
      // </div>
    )

  }

  calcToolbarOffset () {

    let viewRect = null

    if (this.props.viewWrapper) {
      viewRect = document.querySelector(this.props.viewWrapper).getBoundingClientRect()
    } else {
      viewRect = document.body.getBoundingClientRect()
    }

    let toolbarRect = this.toolbarElement.getBoundingClientRect()
    let imageRect = this.imageElement.getBoundingClientRect()
    let right = imageRect.right - imageRect.width / 2 + toolbarRect.width / 2
    let left = imageRect.left + imageRect.width / 2 - toolbarRect.width / 2

    right = viewRect.right - right
    left = left - viewRect.left

    if (right < 10) {
      return right - 10
    } else if (left < 10) {
      return left * -1 + 10
    } else {
      return 0
    }

  }

  removeImage = (e) => {
    console.log('removeImage==============');
    this.props.editor.removeBlock(this.props.block)
    this.props.editor.setEditorProp('readOnly', false)
  }

  toggleLinkEditor = () => {
    this.setState({
      linkEditorVisible: !this.state.linkEditorVisible,
      sizeEditorVisible: false
    })
  }

  toggleSizeEditor = () => {
    this.setState({
      linkEditorVisible: false,
      sizeEditorVisible: !this.state.sizeEditorVisible
    })
  }

  handleLinkInputKeyDown = (e) => {

    if (e.keyCode === 13) {
      this.confirmImageLink()
    } else {
      return
    }

  }

  setImageLink = (e) => {

    this.setState({
      tempLink: e.currentTarget.value
    })

    return

  }

  setImageLinkTarget (link_target) {

    link_target = link_target === '_blank' ? '' : '_blank'
    this.props.editor.setMediaData(this.props.entityKey, { link_target })
    window.setImmediate(this.props.editor.forceRender)

  }

  confirmImageLink = () => {

    const { tempLink: link } = this.state

    if (link !== null) {
      this.props.editor.setMediaData(this.props.entityKey, { link })
      window.setImmediate(this.props.editor.forceRender)
    }

  }

  handleSizeInputKeyDown = (e) => {

    if (e.keyCode === 13) {
      this.confirmImageSize()
    } else {
      return
    }

  }

  setImageWidth = ({ currentTarget }) => {

    let { value } = currentTarget

    value && !isNaN(value) && (value = value + 'px')

    this.setState({
      tempWidth: value
    })

    return

  }

  setImageHeight = ({ currentTarget }) => {

    let { value } = currentTarget

    value && !isNaN(value) && (value = value + 'px')

    this.setState({
      tempHeight: value
    })

    return

  }

  confirmImageSize = () => {

    const { tempWidth: width, tempHeight: height } = this.state
    const newImageSize = {}

    width !== null && (newImageSize.width = width);
    height !== null && (newImageSize.height = height);

    this.props.editor.setMediaData(this.props.entityKey, newImageSize)
    window.setImmediate(this.props.editor.forceRender)

  }

  setImageFloat = (e) => {

    const { float } = e.currentTarget.dataset
    this.props.editor.setMediaPosition(this.props.block, { float })
    this.props.editor.setEditorProp('readOnly', false)

  }

  setImageAlignment = (e) => {

    const { alignment } = e.currentTarget.dataset
    this.props.editor.setMediaPosition(this.props.block, { alignment })
    this.props.editor.setEditorProp('readOnly', false)

  }

  showToolbar = () => {

    if (!this.state.toolbarVisible) {
      this.setState({
        toolbarVisible: true
      }, () => {
        this.props.editor.setEditorProp('readOnly', true)
        this.setState({
          toolbarOffset: this.calcToolbarOffset()
        })
      })
    }

  }

  hideToolbar = () => {
    this.setState({
      toolbarVisible: false
    }, () => {
      this.props.editor.setEditorProp('readOnly', false)
    })
  }

}