import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TestPage = () => {
  const [baseUrl] = useState('/api');
  const [method] = useState('POST');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image1Id, setImage1Id] = useState(null);
  const [image2Id, setImage2Id] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [jobStatus, setJobStatus] = useState(null);
  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${baseUrl}/upload-image/`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  };

  const checkJobStatus = async (jobId) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/job/${jobId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to check job status: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setJobStatus({
        status: data.status,
        message: data.message,
        progress: data.progress,
        result: data.result,
        error: data.error,
        job_id: jobId
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (jobId) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/download/${jobId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runTest = async () => {
    if (!image1 || !image2) {
      setError('Please select both images');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload first image
      if (step === 1) {
        const result1 = await uploadImage(image1);
        setImage1Id(result1.image_id);
        setStep(2);
      }
      // Step 2: Upload second image
      else if (step === 2) {
        const result2 = await uploadImage(image2);
        setImage2Id(result2.image_id);
        setStep(3);
      }
      // Step 3: Style mixing
      else if (step === 3) {
        if (!jobStatus) {  // Only send the request if jobStatus is null
          const response = await fetch(`${baseUrl}/style-mixing/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
            redirect: 'follow',
            body: JSON.stringify({
              source_image_id: image1Id,
              target_image_id: image2Id,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Style mixing failed: ${response.statusText} - ${errorText}`);
          }

          const data = await response.json();
          setJobStatus(data);
          setTestResult({
            status: response.status,
            statusText: response.statusText,
            data,
            image1Id,
            image2Id
          });
        }
      }
    } catch (err) {
      setError(err.message);
      setTestResult(null);
      setJobStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    switch (step) {
      case 1:
        return 'Upload First Image';
      case 2:
        return 'Upload Second Image';
      case 3:
        return 'Start Style Mixing';
      default:
        return 'Start Over';
    }
  };

  return (
    <Container>
      <Title>Image Style Mixing Test</Title>
      <TestSection>
        <InputGroup>
          <Label>Base URL:</Label>
          <Input
            type="text"
            value={baseUrl}
            disabled
          />
        </InputGroup>

        <InputGroup>
          <Label>Method:</Label>
          <Input
            type="text"
            value={method}
            disabled
          />
        </InputGroup>

        <InputGroup>
          <Label>First Image:</Label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setImage1)}
          />
          {image1 && (
            <ImagePreview>
              <img src={URL.createObjectURL(image1)} alt="Preview 1" />
              <span>{image1.name}</span>
            </ImagePreview>
          )}
          {image1Id && (
            <ImageId>Image ID: {image1Id}</ImageId>
          )}
        </InputGroup>

        <InputGroup>
          <Label>Second Image:</Label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setImage2)}
          />
          {image2 && (
            <ImagePreview>
              <img src={URL.createObjectURL(image2)} alt="Preview 2" />
              <span>{image2.name}</span>
            </ImagePreview>
          )}
          {image2Id && (
            <ImageId>Image ID: {image2Id}</ImageId>
          )}
        </InputGroup>

        <TestButton
          onClick={runTest}
          disabled={loading || !image1 || !image2 || jobStatus?.status === 'processing'}
        >
          {getButtonText()}
        </TestButton>

        {error && (
          <ErrorSection>
            <ErrorTitle>Error:</ErrorTitle>
            <ErrorContent>{error}</ErrorContent>
          </ErrorSection>
        )}

        {jobStatus && (
          <StatusSection status={jobStatus.status}>
            <StatusTitle>Job Status:</StatusTitle>
            <StatusContent>
              <div>Status: {jobStatus.status}</div>
              <div>Message: {jobStatus.message}</div>
              <div>Progress: {jobStatus.progress}%</div>
              {jobStatus.error && <div>Error: {jobStatus.error}</div>}
              {jobStatus.result && <div>Result: {JSON.stringify(jobStatus.result, null, 2)}</div>}
              <div>Job ID: {jobStatus.job_id}</div>
            </StatusContent>
            {jobStatus.status === 'processing' && (
              <CheckStatusButton
                onClick={() => checkJobStatus(jobStatus.job_id)}
                disabled={loading}
              >
                Check Status
              </CheckStatusButton>
            )}
            {jobStatus.status === 'completed' && (
              <DownloadButton
                onClick={() => handleDownload(jobStatus.job_id)}
                disabled={loading}
              >
                Download Result
              </DownloadButton>
            )}
            {downloadUrl && (
              <DownloadLink href={downloadUrl} download="result.zip">
                Click here to download
              </DownloadLink>
            )}
          </StatusSection>
        )}

        {testResult && (
          <ResultSection>
            <ResultTitle>Test Result:</ResultTitle>
            <ResultContent>
              <div>First Image ID: {testResult.image1Id}</div>
              <div>Second Image ID: {testResult.image2Id}</div>
              <div>Status: {testResult.status}</div>
              <div>Status Text: {testResult.statusText}</div>
              <div>Response Data: {JSON.stringify(testResult.data, null, 2)}</div>
            </ResultContent>
          </ResultSection>
        )}
      </TestSection>
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const TestSection = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px ${props => props.theme.shadow};
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }

  &:disabled {
    background: ${props => props.theme.background}80;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.border};
  }

  span {
    color: ${props => props.theme.text};
    font-size: 0.9rem;
  }
`;

const TestButton = styled.button`
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  transition: all 0.2s ease;
  width: 100%;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ResultSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const ErrorSection = styled(ResultSection)`
  border-color: ${props => props.theme.danger};
  background: ${props => props.theme.danger}10;
`;

const ResultTitle = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
`;

const ErrorTitle = styled(ResultTitle)`
  color: ${props => props.theme.danger};
`;

const ResultContent = styled.pre`
  color: ${props => props.theme.text};
  background: ${props => props.theme.surface};
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ErrorContent = styled(ResultContent)`
  color: ${props => props.theme.danger};
`;

const ImageId = styled.div`
  margin-top: 0.5rem;
  color: ${props => props.theme.primary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const StatusSection = styled(ResultSection)`
  background: ${props => {
    switch (props.status) {
      case 'processing':
        return props.theme.primary + '10';
      case 'completed':
        return props.theme.success + '10';
      case 'failed':
        return props.theme.danger + '10';
      default:
        return props.theme.background;
    }
  }};
  border-color: ${props => {
    switch (props.status) {
      case 'processing':
        return props.theme.primary;
      case 'completed':
        return props.theme.success;
      case 'failed':
        return props.theme.danger;
      default:
        return props.theme.border;
    }
  }};
`;

const StatusTitle = styled(ResultTitle)`
  color: ${props => {
    switch (props.status) {
      case 'processing':
        return props.theme.primary;
      case 'completed':
        return props.theme.success;
      case 'failed':
        return props.theme.danger;
      default:
        return props.theme.text;
    }
  }};
`;

const StatusContent = styled.div`
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  line-height: 1.5;

  div {
    margin-bottom: 0.5rem;
  }
`;

const CheckStatusButton = styled.button`
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const DownloadButton = styled.button`
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const DownloadLink = styled.a`
  display: block;
  margin-top: 1rem;
  color: #000000;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: #333333;
  }
`;

export default TestPage; 