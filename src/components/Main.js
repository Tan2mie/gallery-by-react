require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
let imageDatas = require('json!../data/imageData.json');

//利用自执行函数，将图片信息转换成图片URL路径信息
imageDatas = (function genImageUrl(imageDataArr){
	for(var i = 0, j = imageDataArr.length; i < j; i++){
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);

function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component{

	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render(){
		var styleObj = {};

		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate){
			styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
					<div className='img-back' onClick={this.handleClick.bind(this)}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class AppComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			imgsArrangeArr: [
				/*{
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse : false,
					isCenter : false
				}*/
			]
		};
	}


	Constant = {
		centerPos:{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	};


	// 翻转图片
	inverse(index){
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	}


	rearrange(centerIndex){
		var imgsArrageArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRighhtSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrageArr.splice(centerIndex,1);

		imgsArrangeCenterArr[0].pos = centerPos;
		imgsArrangeCenterArr[0].rotate = 0;
		imgsArrangeCenterArr[0].isCenter = true;

		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrageArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrageArr.splice(topImgSpliceIndex,topImgNum);
		imgsArrangeTopArr.forEach(function (value,index) {
			imgsArrangeTopArr[index] = {
				pos : {
					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate : get30DegRandom(),
				isCenter:false
			};
		});

		for(var i = 0, j = imgsArrageArr.length, k = j/2; i < j; i++){
			var hPosRangeLORX = null;
			if( i < k ){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRighhtSecX;
			}

			imgsArrageArr[i] = {
				pos : {
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter:false
			};
		}

		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrageArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		imgsArrageArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr:imgsArrageArr
		});
	}


	center(index){
		return function () {
			this.rearrange(index);
		}.bind(this);
	}


	componentDidMount(){
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfstageW = Math.ceil(stageW/2),
			halfstageH = Math.ceil(stageH/2);

		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW/2),
			halfImgH = Math.ceil(imgH/2);

		this.Constant.centerPos = {
			left:halfstageW - halfImgW,
			top:halfstageH - halfImgH
		};

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfstageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfstageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfstageH - halfImgW * 3;
		this.Constant.vPosRange.x[0] = halfstageW - imgW;
		this.Constant.vPosRange.x[1] = halfstageW;

		this.rearrange(0);
	}

  	render() {
  	  	var controllerUnit = [];
	  	var imgFigures = [];

		imageDatas.forEach(function (value,index) {
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					inCenter:false
				}
			}
			imgFigures.push(<ImgFigure data={value} key={'imgFigures'+index} ref={'imgFigure'+ index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));

    	return (
    		<section className = "stage" ref="stage">
    			<section className = "img-sec">
					{imgFigures}
				</section>
    			<nav className = "controller-nav">
					{controllerUnit}
				</nav>
    		</section>
    	);
  	}
}

AppComponent.defaultProps = {};

export default AppComponent;
