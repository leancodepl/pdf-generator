import styled from "styled-components"

const SampleComponent: React.FunctionComponent<{ testString?: string }> = ({ testString }) => (
  <>
    <BlueDiv>sample pdf generator component</BlueDiv>
    {testString}
  </>
)

const BlueDiv = styled.div`
  background: lightskyblue;

  color: white;
`

export default SampleComponent
