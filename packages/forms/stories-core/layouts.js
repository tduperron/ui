import React from 'react';
import { Layout, Drawer } from '@talend/react-components';
import { UIForm } from '../src/UIForm';

const simple = require('./json/concepts/core-simple.json');

function LayoutDrawer() {
	const drawers = [
		<Drawer.Container>
			<UIForm {...simple} />
		</Drawer.Container>,
	];
	return (
		<Layout drawers={drawers} mode="TwoColumns">
			<div style={{ margin: 10 }}>
				<h1>UIForm in a drawer</h1>
			</div>
		</Layout>
	);
}

export default [{ name: 'drawer', story: LayoutDrawer }];