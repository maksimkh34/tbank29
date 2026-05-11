import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

type BpmnViewerProps = {
  url: string;
  height?: number | string;
};

function BpmnViewerClient({url, height = 650}: BpmnViewerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resolvedUrl = useBaseUrl(url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;

    async function renderDiagram() {
      setError(null);

      const BpmnJS = (await import('bpmn-js/lib/NavigatedViewer')).default;

      if (cancelled || !containerRef.current) {
        return;
      }

      const bpmnViewer = new BpmnJS({
        container: containerRef.current,
      });
      viewer = bpmnViewer;

      const response = await fetch(resolvedUrl);

      if (!response.ok) {
        throw new Error(`Не удалось загрузить BPMN-файл: ${response.status} ${response.statusText}`);
      }

      const xml = await response.text();

      await bpmnViewer.importXML(xml);

      const canvas: any = bpmnViewer.get('canvas');
      canvas.zoom('fit-viewport');
    }

    renderDiagram().catch((renderError: unknown) => {
      console.error('Failed to render BPMN diagram', renderError);

      if (!cancelled) {
        setError(renderError instanceof Error ? renderError.message : 'Не удалось отобразить BPMN-диаграмму');
      }
    });

    return () => {
      cancelled = true;

      if (viewer) {
        viewer.destroy();
      }
    };
  }, [resolvedUrl]);

  return (
    <div>
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            border: '1px solid var(--ifm-color-danger)',
            borderRadius: 8,
            color: 'var(--ifm-color-danger-dark)',
          }}>
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height,
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'white',
        }}
      />
    </div>
  );
}

export default function BpmnViewer(props: BpmnViewerProps): React.ReactElement {
  return (
    <BrowserOnly fallback={<div>Загрузка BPMN-диаграммы...</div>}>
      {() => <BpmnViewerClient {...props} />}
    </BrowserOnly>
  );
}
