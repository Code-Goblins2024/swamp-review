/**
 * Interactable Google Maps widget for displaying dorm locations and nearby interest points
 */
import { AdvancedMarker, useAdvancedMarkerRef, Pin } from "@vis.gl/react-google-maps";
import { Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PropTypes from "prop-types";

const CustomMap = ({ housingName, housingPosition, pois }) => {
	const [selectedPoi, setSelectedPoi] = useState(null);
	const [selectedMarker, setSelectedMarker] = useState(null);
	const [infoWindowShown, setInfoWindowShown] = useState(false);

	const onMapClick = useCallback(() => {
		setSelectedPoi(null);
		setSelectedMarker(null);
		setInfoWindowShown(false);
	}, []);

	const onMarkerClick = useCallback(
		(id, marker) => {
			setSelectedPoi(id);

			if (marker) {
				setSelectedMarker(marker);
			}

			if (id !== selectedPoi) {
				setInfoWindowShown(true);
			} else {
				setInfoWindowShown((isShown) => !isShown);
			}
		},
		[selectedPoi]
	);

	const handleInfoWindowClose = useCallback(() => setInfoWindowShown(false), []);

	return (
		<Map defaultZoom={15} defaultCenter={housingPosition} mapId={`${housingName}_MAP`} onClick={onMapClick}>
			{pois.map((_poi) => (
				<AdvancedMarkerWithRef
					onMarkerClick={(marker) => onMarkerClick(_poi.key, marker)}
					key={_poi.key}
					position={_poi.location}
				>
					<Pin background={"#E8644B"} glyphColor={"#000"} borderColor={"#000"} />
				</AdvancedMarkerWithRef>
			))}
			<AdvancedMarkerWithRef
				onMarkerClick={(marker) => onMarkerClick(housingName, marker)}
				key={housingName}
				position={housingPosition}
			>
				{/* <Pin background={"#1B45C9"} glyphColor={"#000"} borderColor={"#000"} /> */}
				<div
					style={{
						position: "absolute",
						top: "050%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "2rem",
						height: "2rem",
						backgroundColor: "#1B45C9",
						borderRadius: "4px",
						display: "flex",
					}}
				>
					<HomeIcon sx={{ color: "white", width: "100%", height: "100%" }} />
				</div>
			</AdvancedMarkerWithRef>

			{infoWindowShown && selectedMarker && (
				<InfoWindow
					anchor={selectedMarker}
					pixelOffset={[0, -2]}
					headerDisabled={true}
					onCloseClick={handleInfoWindowClose}
				>
					<span style={{ fontWeight: 700 }}>{selectedPoi}</span>
				</InfoWindow>
			)}
		</Map>
	);
};

CustomMap.propTypes = {
	housingName: PropTypes.string,
	housingPosition: PropTypes.object,
	pois: PropTypes.array,
};

export default CustomMap;

export const AdvancedMarkerWithRef = (props) => {
	const { children, onMarkerClick, ...advancedMarkerProps } = props;
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<AdvancedMarker
			onClick={() => {
				if (marker) {
					onMarkerClick(marker);
				}
			}}
			ref={markerRef}
			{...advancedMarkerProps}
		>
			{children}
		</AdvancedMarker>
	);
};
