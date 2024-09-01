import React from "react";
import {Typography , Button} from "antd";
const { Title, Paragraph, Text, Link } = Typography;

class Welcome extends React.PureComponent {
  constructor(props) {
    super(props);
    let {turnTo} = props;
  }
  render() {
    return (
      <div>
        <Text>Welcome to the Welcome Page</Text>
        <Button type="primary" onClick={() => this.props.turnTo('/core')}>Go to Core</Button>
      </div>
    );
  }
}

export default Welcome;